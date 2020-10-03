const dotenv = require("dotenv");
const { db } = require("../util/admin");
dotenv.config();
const moment = require("moment");

// Test keys
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripePrivateKey = process.env.STRIPE_PRIVATE_KEY;

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

    req.session.accountID = account.id;

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
    const { accountID } = req.session;
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
  let orderID = generatePushID();

  calculateOrderAmount(photographerBooked)
    .then((amount) => {
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

                date: req.body.date,
                time: req.body.time,

                photographerFirstName: req.body.photographerFirstName,
                photographerLastName: req.body.photographerLastName,
                photographerProfileImage: req.body.photographerProfileImage,
                photographerID: req.body.photographerID,
                photographerEmail: req.body.photographerEmail,

                consumerFirstName: req.body.consumerFirstName,
                consumerLastName: req.body.consumerLastName,
                consumerProfileImage: req.body.consumerProfileImage,
                consumerID: req.body.consumerID,
                consumerEmail: req.body.consumerEmail,
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

  const [paymentID, shootDate, shootTime, amount] = await getPaymentID(
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
function calculateOrderAmount(photographerId) {
  return db
    .collection("photographer")
    .doc(photographerId)
    .get()
    .then((doc) => {
      return doc.data().ratePerHour * 100;
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ error: "Photographer not found!" });
    });
}

// Calculate how much we will take as a fee
function calculateFeeAmount(amount) {
  return 0.05 * amount;
}

// Generate unique order id
generatePushID = (function () {
  // Modeled after base64 web-safe chars, but ordered by ASCII.
  var PUSH_CHARS =
    "ABBCCDDEFGHHIJKKLMNPQRSTUVWXYZ123456789abcdefghijklmnpqrstuvwxyz";

  // Timestamp of last push, used to prevent local collisions if you push twice in one ms.
  var lastPushTime = 0;

  // We generate 72-bits of randomness which get turned into 12 characters and appended to the
  // timestamp to prevent collisions with other clients.  We store the last characters we
  // generated because in the event of a collision, we'll use those same characters except
  // "incremented" by one.
  var lastRandChars = [];

  return function () {
    var now = new Date().getTime();
    var duplicateTime = now === lastPushTime;
    lastPushTime = now;

    var timeStampChars = new Array(8);
    for (var i = 7; i >= 0; i--) {
      timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
      // NOTE: Can't use << here because javascript will convert to int and lose the upper bits.
      now = Math.floor(now / 64);
    }
    if (now !== 0)
      throw new Error("We should have converted the entire timestamp.");

    var id = timeStampChars.join("");

    if (!duplicateTime) {
      for (i = 0; i < 12; i++) {
        lastRandChars[i] = Math.floor(Math.random() * 64);
      }
    } else {
      // If the timestamp hasn't changed since last push, use the same random number, except incremented by 1.
      for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
        lastRandChars[i] = 0;
      }
      lastRandChars[i]++;
    }
    for (i = 0; i < 12; i++) {
      id += PUSH_CHARS.charAt(lastRandChars[i]);
    }
    if (id.length != 20) throw new Error("Length should be 20.");

    return id;
  };
})();

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

  if (hours < 24) {
    return false;
  } else {
    return true;
  }
}

// Get payment ID from users current order to refund
function getPaymentID(userID, orderID) {
  console.log("orderID: ", orderID);
  return db
    .collection("users")
    .doc(userID)
    .collection("orders")
    .doc(orderID)
    .get()
    .then((doc) => {
      return [
        doc.data().paymentID,
        doc.data().shootDate,
        doc.data().shootTime,
        doc.data().amount,
      ];
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
