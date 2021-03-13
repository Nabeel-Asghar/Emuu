const dotenv = require("dotenv");
const { db } = require("../util/admin");
dotenv.config();
const moment = require("moment");
const { customAlphabet } = require("nanoid");

// Test keys
const stripePrivateKey = process.env.STRIPE_PRIVATE_KEY;
const paymentFee = process.env.paymentFee;

const stripe = require("stripe")(stripePrivateKey);

const { handleCancel } = require("./webhooks.js");

// Photographer Routes
//
// Onboard new photographer to stripe
exports.onboardUser = async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      type: "express",
      settings: {
        payouts: {
          schedule: {
            interval: "manual",
          },
        },
      },
    });

    const origin = "http://localhost:3000/";
    generateAccountLink(account.id, origin).then((accountLinkURL) => {
      let stripeDetails = {
        stripeID: account.id,
      };

      db.collection("photographer")
        .doc(req.user.uid)
        .update(stripeDetails)
        .then(() => {
          return res.json({ url: accountLinkURL });
        })
        .catch((err) => {
          console.log("error putting stripe details in database");
        });
    });
  } catch (err) {
    console.log("stripe error: ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

// If page is refreshed, redirect
exports.onboardUserRefresh = async (req, res) => {
  try {
    const origin = "http://localhost:3000/";
    const accountID = await getPhotographerStripeID(req.user.uid);
    const accountLinkURL = await generateAccountLink(accountID, origin);
    return res.json({ url: accountLinkURL });
  } catch (err) {
    console.log("stripe refresh error: ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

// Get status of onboard
exports.getStripeOnboardStatus = (req, res) => {
  db.collection("photographer")
    .doc(req.user.uid)
    .get()
    .then((doc) => {
      if (doc.data().stripeID) {
        return res.json({ status: true });
      } else {
        return res.json({ status: false });
      }
    })
    .catch(() => {
      return res.json({ status: false });
    });
};

// Customer Routes
//
// Create charge when customer is booking photographer
exports.createPayment = (req, res) => {
  let photographerBooked = req.params.photographerId;
  let orderID = generateOrderID();

  if (res.locals.photographer) {
    return res.json({ message: "Photographers cannot book shoots." });
  }

  calculateOrderAmount(photographerBooked, req.body.selectedShoot.name)
    .then((amount) => {
      console.log("amount1: ", amount);
      getPhotographerStripeID(photographerBooked)
        .then((connectedStripeAccountID) => {
          console.log("amount: ", amount);
          console.log("stripeid: ", connectedStripeAccountID);
          stripe.paymentIntents
            .create({
              payment_method_types: ["card"],
              receipt_email: req.body.consumerEmail,
              amount: amount,
              currency: "usd",
              application_fee_amount: calculateFeeAmount(amount),
              transfer_data: {
                destination: connectedStripeAccountID,
              },
              metadata: {
                orderID: orderID,
                shootType: req.body.selectedShoot.name,
                date: req.body.date,
                time: req.body.time,
                photographerFirstName: req.body.photographerFirstName,
                photographerLastName: req.body.photographerLastName,
                photographerProfileImage: req.body.photographerProfileImage,
                photographerID: req.body.photographerID,
                photographerEmail: req.body.photographerEmail,
                photographerThumbnailImage: req.body.photographerThumbnailImage,
                consumerFirstName: req.body.consumerFirstName,
                consumerLastName: req.body.consumerLastName,
                consumerProfileImage: req.body.consumerProfileImage,
                consumerID: req.body.consumerID,
                consumerEmail: req.body.consumerEmail,
                consumerThumbnailImage: req.body.consumerThumbnailImage,
              },
            })
            .then((paymentIntent) => {
              return res.json({ client_secret: paymentIntent.client_secret });
            })
            .catch((err) => {
              console.log("Error getting payment intent ", err);
            });
        })
        .catch((err) => {
          console.log("Error getting connected stripe ID", err);
        });
    })
    .catch((err) => {
      console.log("Error getting rate per hour ", err);
    });
};

// Refund customer when CUSTOMER cancels
exports.refund = async (req, res) => {
  let userID = req.user.uid;
  let orderID = req.body.orderID;

  const { paymentID, shootDate, shootTime, amount } = await getPaymentID(
    userID,
    orderID
  );

  // will only give refund if customer cancelled 24 hours before shoot
  let refundability = await validateRefund(shootDate, shootTime);

  // if before 24 hours or photographer cancels, give full refund and cancel order
  if (refundability) {
    await processRefund(paymentID, amount);
  }

  // otherwise 50% refund and cancel order
  else {
    await processRefund(paymentID, amount / 2);
  }

  console.log("Refund in progress. This may take a few moments.");

  return res.json({
    message: "Refund in progress. This may take a few moments.",
  });
};

// Refund customer when PHOTOGRAPHER cancels
exports.refundFromPhotographer = async (req, res) => {
  let userID = req.user.uid;
  let orderID = req.body.orderID;

  const paymentID = await getPaymentIDAsPhotographer(userID, orderID);

  await processRefundFromPhotographer(paymentID);

  console.log("Refund in progress. This may take a few moments.");

  return res.json({
    message: "Refund in progress. This may take a few moments.",
  });
};

// Functions
//
// Generate link for photographers creating connecting Stripe Accounts
function generateAccountLink(accountID, origin) {
  return stripe.accountLinks
    .create({
      type: "account_onboarding",
      account: accountID,
      refresh_url: `${origin}onboard/refresh`,
      return_url: `${origin}onboard/success`,
    })
    .then((link) => link.url);
}

// Get photographers stripe ID
function getPhotographerStripeID(photographerID) {
  return db
    .collection("/photographer")
    .doc(photographerID)
    .get()
    .then((doc) => {
      return doc.data().stripeID;
    })
    .catch(() => {
      return res.status(500).json({ message: "Photographer not found" });
    });
}

// Calculate how much to charge customer
async function calculateOrderAmount(photographerId, type) {
  let amount = null;
  await db
    .collection("photographer")
    .doc(photographerId)
    .get()
    .then((doc) => {
      try {
        doc.data().pricing.map((item, index) => {
          if (item.name === type) {
            console.log("item.price", item.price);
            amount = item.price * 100;
          }
        });
      } catch (e) {
        return res.status(500).json({ error: "Shoot type not found" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "Photographer not found!" });
    });

  return amount;
}

// Calculate how much we will take as a fee
function calculateFeeAmount(amount) {
  return paymentFee * amount;
}

// Generate unique order id
function generateOrderID() {
  const alphabet = "0123456789abcdef";
  const nanoid = customAlphabet(alphabet, 16);
  return nanoid();
}

// validate if full refund is returned
function validateRefund(shootDate, shootTime) {
  var today = moment().format();

  var dates = shootDate.split("-");
  var times = shootTime.split(":");

  var stringFormat =
    dates[2] + "-" + dates[0] + "-" + dates[1] + " " + times[0];

  var shootDate = moment(stringFormat);

  var duration = moment.duration(shootDate.diff(today));
  var hours = duration.asHours();

  if (hours < 12) {
    return false;
  } else {
    return true;
  }
}

// Get payment ID from users current order to refund
function getPaymentID(userID, orderID) {
  return db
    .collection("users")
    .doc(userID)
    .collection("orders")
    .doc(orderID)
    .get()
    .then((doc) => {
      return {
        paymentID: doc.data().paymentID,
        shootDate: doc.data().shootDate,
        shootTime: doc.data().shootTime,
        amount: doc.data().amount,
      };
    })
    .catch((err) => {
      return null;
    });
}

function getPaymentIDAsPhotographer(photographerID, orderID) {
  return db
    .collection("photographer")
    .doc(photographerID)
    .collection("orders")
    .doc(orderID)
    .get()
    .then((doc) => {
      return doc.data().paymentID;
    })
    .catch((err) => {
      return null;
    });
}

// Process refund intiated by customer
function processRefund(paymentID, amount) {
  const refund = stripe.refunds.create({
    payment_intent: paymentID,
    reverse_transfer: true,
    amount: amount * 100,
    refund_application_fee: false,
  });
}

// Process refund intiated by photographer
function processRefundFromPhotographer(paymentID) {
  const refund = stripe.refunds.create({
    payment_intent: paymentID,
    reverse_transfer: true,
    refund_application_fee: true,
    metadata: { photographerCancel: "true" },
  });
}

async function payOut(orderID, consumerID, photographerID) {
  try {
    const { paymentID } = await getPaymentID(consumerID, orderID);
    await transferToBank(paymentID, orderID, consumerID, photographerID);
    console.log("Paid out photographer");
    return true;
  } catch (err) {
    console.log("Error paying out", err);
    return err;
  }
}

async function transferToBank(paymentID, orderID, consumerID, photographerID) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentID);

  const {
    amount,
    application_fee_amount,
    transfer_data: { destination },
  } = paymentIntent;

  const payoutAmount = amount - application_fee_amount;
  try {
    console.log("Paying out photographer", orderID);
    const payout = await stripe.payouts.create(
      {
        amount: payoutAmount,
        currency: "usd",
        metadata: {
          orderID: orderID,
          consumerID: consumerID,
          photographerID: photographerID,
        },
      },
      { stripeAccount: destination }
    );
    return true;
  } catch (err) {
    console.log("Error paying out photographer: ", err);
    return false;
  }
}

exports.payOut = payOut;
