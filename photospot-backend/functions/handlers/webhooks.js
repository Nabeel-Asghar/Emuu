const { admin, db } = require("../util/admin");
const dotenv = require("dotenv");
dotenv.config();
const payment__webhook_secret = process.env.payment_signing_secret;
const { shootStatus } = require("../util/constants");

// Import email functions
const email = require("./email");

exports.webhooks = (req, res) => {
  let event = req.body;

  switch (event.type) {
    // successful payment
    case "payment_intent.succeeded":
      console.log("Successful Payment");
      handlePayment(
        event.data.object.metadata,
        event.data.object.amount,
        event.data.object.id
      );
      break;

    // refund
    case "charge.refunded":
      if (event.data.object.refunds.data[0].metadata.photographerCancel) {
        console.log("Refund By Photographer Successful");
        handleRefundByPhotographer(
          event.data.object.metadata,
          event.data.object.amount,
          event.data.object.id
        );
      } else {
        console.log("Refund By Customer Successful");
        handleRefund(
          event.data.object.metadata,
          event.data.object.amount,
          event.data.object.id
        );
      }

      break;

    case "payout.paid":
      console.log("Successful Payout", event.data);
      handlePayout(
        event.data.object.metadata,
        event.data.object.amount,
        event.data.object.id
      );
  }

  return res.status(200).end();
};

// handle payouts
async function handlePayout(orderDetails, amount, payoutID) {
  let orderID = orderDetails.orderID;
  let photographerID = orderDetails.photographerID;
  let consumerID = orderDetails.consumerID;

  let booking = await getOrderDetails(orderID);
  booking.status = shootStatus.completed;

  await deleteFromOrders(orderID);
  await deleteFromPhotographers(photographerID, orderID);
  await deleteFromUser(consumerID, orderID);

  await addToOverallCompletedOrders(booking, orderID);
  await addToUserCompletedOrders(consumerID, orderID, booking);
  await addToPhotographersCompletedOrders(photographerID, orderID, booking);

  await email.emailPayout(booking);
}

// handle successful refunds intiated by customer
async function handleRefund(orderDetails, chargeAmount, paymentID) {
  let orderID = orderDetails.orderID;
  let shootType = orderDetails.shootType;
  let photographerID = orderDetails.photographerID;
  let consumerID = orderDetails.consumerID;
  let shootDate = orderDetails.date;
  let shootTime = orderDetails.time;

  let booking = await bookingObject(
    orderID,
    shootType,
    orderDetails,
    chargeAmount,
    paymentID,
    shootStatus.customer
  );

  await deleteFromOrders(orderID);
  await deleteFromPhotographers(photographerID, orderID);
  await deleteFromUser(consumerID, orderID);
  await freePhotographerTimeslot(photographerID, shootDate, shootTime);

  await addToOverallCompletedOrders(booking, orderID);
  await addToUserCompletedOrders(consumerID, orderID, booking);
  await addToPhotographersCompletedOrders(photographerID, orderID, booking);

  await emailRefundsByCustomer(booking);
}

// handle refund intiated by photographer
async function handleRefundByPhotographer(
  orderDetails,
  chargeAmount,
  paymentID
) {
  let orderID = orderDetails.orderID;
  let shootType = orderDetails.shootType;
  let photographerID = orderDetails.photographerID;
  let consumerID = orderDetails.consumerID;
  let shootDate = orderDetails.date;
  let shootTime = orderDetails.time;

  let booking = await bookingObject(
    orderID,
    shootType,
    orderDetails,
    chargeAmount,
    paymentID,
    shootStatus.photographer
  );

  await deleteFromOrders(orderID);
  await deleteFromPhotographers(photographerID, orderID);
  await deleteFromUser(consumerID, orderID);
  await freePhotographerTimeslot(photographerID, shootDate, shootTime);

  await addToOverallCompletedOrders(booking, orderID);
  await addToUserCompletedOrders(consumerID, orderID, booking);
  await addToPhotographersCompletedOrders(photographerID, orderID, booking);

  await emailRefundsByPhotographer(booking);
}

// handle successful payments
async function handlePayment(orderDetails, chargeAmount, paymentID) {
  let orderID = orderDetails.orderID;
  let shootType = orderDetails.shootType;
  let shootDate = orderDetails.date;
  let shootTime = orderDetails.time;
  let photographerID = orderDetails.photographerID;
  let consumerID = orderDetails.consumerID;

  let booking = await bookingObject(
    orderID,
    shootType,
    orderDetails,
    chargeAmount,
    paymentID,
    shootStatus.inProgress
  );

  let chat = await chatObject(orderDetails);
  let chatName = `${orderDetails.photographerEmail}:${orderDetails.consumerEmail}`;

  updateMainOrders(orderID, booking);
  updatePhotographerOrders(photographerID, orderID, booking);
  updateUserOrders(consumerID, orderID, booking);
  fillPhotographerTimeslot(photographerID, shootDate, shootTime);
  createPhotoVault(orderID, photographerID, consumerID);
  emailOrderDetails(booking);
  createChat(chatName, chat);
}

// helper functions
//
// create booking object
function bookingObject(
  orderID,
  shootType,
  orderDetails,
  chargeAmount,
  paymentID,
  status
) {
  let amount = chargeAmount / 100;
  let shootDate = orderDetails.date;
  let shootTime = orderDetails.time;

  var myDate = shootDate.split("-");
  var newDate = myDate[2] + "," + myDate[0] + "," + myDate[1];
  var formattedDate = new Date(newDate);

  let booking = {
    id: orderID,
    shootType: shootType,
    paymentID: paymentID,
    amount: amount,
    shootDate: shootDate,
    shootTime: shootTime,
    photographerFirstName: orderDetails.photographerFirstName,
    photographerLastName: orderDetails.photographerLastName,
    photographerProfileImage: orderDetails.photographerProfileImage,
    photographerID: orderDetails.photographerID,
    photographerEmail: orderDetails.photographerEmail,
    consumerFirstName: orderDetails.consumerFirstName,
    consumerLastName: orderDetails.consumerLastName,
    consumerProfileImage: orderDetails.consumerProfileImage,
    consumerID: orderDetails.consumerID,
    consumerEmail: orderDetails.consumerEmail,
    createdAt: new Date().toISOString(),
    formattedDate: formattedDate,
    status: status,
  };

  return booking;
}

// create chat object
function chatObject(orderDetails) {
  let photographerName = `${orderDetails.photographerFirstName} ${orderDetails.photographerLastName}`;
  let consumerName = `${orderDetails.consumerFirstName} ${orderDetails.consumerLastName}`;

  let photographerEmail = orderDetails.photographerEmail;
  let consumerEmail = orderDetails.consumerEmail;

  let photographerThumbnailImage = orderDetails.photographerThumbnailImage;
  let consumerThumbnailImage = orderDetails.consumerThumbnailImage;

  return {
    names: [photographerName, consumerName],
    [photographerEmail]: { profileImage: photographerThumbnailImage },
    [consumerEmail]: { profileImage: consumerThumbnailImage },
    receiverHasRead: false,
    users: [photographerEmail, consumerEmail],
    timestamp: Date.now(),
  };
}

// create photo vault for this order
function createPhotoVault(orderID, photographerID, consumerID) {
  let intialObject = {
    photographerID: photographerID,
    consumerID: consumerID,
  };

  db.collection("photoVault")
    .doc(`${orderID}`)
    .set(intialObject)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

// create chat between consumer and photographer
function createChat(chatName, chat) {
  var docRef = db.collection("chats").doc(chatName);
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        return;
      } else {
        docRef
          .set(chat)
          .then(() => {
            return true;
          })
          .catch((err) => {
            console.log(
              "error creating chat between photographer and consumer",
              err
            );
            return false;
          });
      }
    })
    .catch((err) => {
      console.log("error creating chat between photographer and consumer", err);
      return false;
    });
}

// update main order collection
function updateMainOrders(orderID, booking) {
  db.collection("allOrders")
    .doc(orderID)
    .set(booking)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

// update photographer orders
function updatePhotographerOrders(photographerID, orderID, booking) {
  db.collection("photographer")
    .doc(photographerID)
    .collection("orders")
    .doc(orderID)
    .set(booking)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

// update user order
function updateUserOrders(consumerID, orderID, booking) {
  db.collection("users")
    .doc(consumerID)
    .collection("orders")
    .doc(orderID)
    .set(booking)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

// fill timeslot for photographer
function fillPhotographerTimeslot(photographerID, shootDate, shootTime) {
  db.collection("photographer")
    .doc(photographerID)
    .collection("bookings")
    .doc(shootDate)
    .update({
      [shootTime]: true,
    })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

// delete from main orders collection
function deleteFromOrders(orderID) {
  db.collection("allOrders")
    .doc(orderID)
    .delete()
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

// delete from photographer orders
function deleteFromPhotographers(photographerID, orderID) {
  db.collection("photographer")
    .doc(photographerID)
    .collection("orders")
    .doc(orderID)
    .delete()
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

// delete from user order's table
function deleteFromUser(consumerID, orderID) {
  db.collection("users")
    .doc(consumerID)
    .collection("orders")
    .doc(orderID)
    .delete()
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

// update timeslot for photographer to be freed up
function freePhotographerTimeslot(photographerID, shootDate, shootTime) {
  db.collection("photographer")
    .doc(photographerID)
    .collection("bookings")
    .doc(shootDate)
    .update({
      [shootTime]: false,
    })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log("update timeslot for photographer", err);
      return false;
    });
}

// add to overall completed orders table
function addToOverallCompletedOrders(booking, orderID) {
  db.collection("completedOrders")
    .doc(orderID)
    .set(booking)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

// add to user's completed orders
function addToUserCompletedOrders(consumerID, orderID, booking) {
  db.collection("users")
    .doc(consumerID)
    .collection("completedOrders")
    .doc(orderID)
    .set(booking)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

// add to photographers's completed orders
function addToPhotographersCompletedOrders(photographerID, orderID, booking) {
  db.collection("photographer")
    .doc(photographerID)
    .collection("completedOrders")
    .doc(orderID)
    .set(booking)
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

function getOrderDetails(orderID) {
  return db
    .collection("allOrders")
    .doc(orderID)
    .get()
    .then((doc) => {
      return doc.data();
    })
    .catch((err) => {
      console.log("error getting order details: ", err);
      return false;
    });
}

// Email functions
//
// email refund details
function emailRefundsByCustomer(booking) {
  email.emailRefundsByCustomer(booking);
}

// email order details
function emailOrderDetails(booking) {
  email.emailOrderDetails(booking);
}

// email refund details
function emailRefundsByPhotographer(booking) {
  email.emailRefundsByPhotographer(booking);
}
