const { admin, db } = require("../util/admin");
const dotenv = require("dotenv");

dotenv.config();
const payment__webhook_secret = process.env.payment_signing_secret;

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

    // refund requested by photographer
    // TODO: detect when photographer cancels verses customer

    // refund requested by customer
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
  }

  return res.status(200).end();
};

// handle successful refunds
async function handleRefund(orderDetails, chargeAmount, paymentID) {
  let photographerID = orderDetails.photographerID;
  let consumerID = orderDetails.consumerID;
  let shootDate = orderDetails.date;
  let shootTime = orderDetails.time;

  let booking = await bookingObject(orderDetails, chargeAmount, paymentID);

  await deleteFromOrders(consumerID);
  await deleteFromPhotographers(photographerID, consumerID);
  await deleteFromUser(consumerID);
  await freePhotographerTimeslot(photographerID, shootDate, shootTime);
  await emailRefundsByCustomer(booking);
}

// handle refund intiated by photographer
async function handleRefundByPhotographer(
  orderDetails,
  chargeAmount,
  paymentID
) {
  let photographerID = orderDetails.photographerID;
  let consumerID = orderDetails.consumerID;
  let shootDate = orderDetails.date;
  let shootTime = orderDetails.time;

  let booking = await bookingObject(orderDetails, chargeAmount, paymentID);

  await deleteFromOrders(consumerID);
  await deleteFromPhotographers(photographerID, consumerID);
  await deleteFromUser(consumerID);
  await freePhotographerTimeslot(photographerID, shootDate, shootTime);
  await emailRefundsByPhotographer(booking);
}

// handle successful payments
async function handlePayment(orderDetails, chargeAmount, paymentID) {
  let shootDate = orderDetails.date;
  let shootTime = orderDetails.time;
  let photographerID = orderDetails.photographerID;
  let consumerID = orderDetails.consumerID;

  let booking = await bookingObject(orderDetails, chargeAmount, paymentID);

  await updateMainOrders(consumerID, booking);
  await updatePhotographerOrders(photographerID, consumerID, booking);
  await updateUserOrders(consumerID, booking);
  await fillPhotographerTimeslot(photographerID, shootDate, shootTime);
  await emailOrderDetails(booking);
}

// helper functions
//
// create booking object
function bookingObject(orderDetails, chargeAmount, paymentID) {
  let amount = chargeAmount / 100;
  let shootDate = orderDetails.date;
  let shootTime = orderDetails.time;

  let photographerFirstName = orderDetails.photographerFirstName;
  let photographerLastName = orderDetails.photographerLastName;
  let photographerProfileImage = orderDetails.photographerProfileImage;
  let photographerID = orderDetails.photographerID;
  let photographerEmail = orderDetails.photographerEmail;

  let consumerFirstName = orderDetails.consumerFirstName;
  let consumerLastName = orderDetails.consumerLastName;
  let consumerProfileImage = orderDetails.consumerProfileImage;
  let consumerID = orderDetails.consumerID;
  let consumerEmail = orderDetails.consumerEmail;

  var myDate = shootDate.split("-");
  var newDate = myDate[2] + "," + myDate[0] + "," + myDate[1];
  var formattedDate = new Date(newDate);

  let booking = {
    id: paymentID,
    amount: amount,
    shootDate: shootDate,
    shootTime: shootTime,
    photographerID: photographerID,
    photographerEmail: photographerEmail,
    photographerFirstName: photographerFirstName,
    photographerLastName: photographerLastName,
    photographerProfileImage: photographerProfileImage,
    consumerID: consumerID,
    consumerEmail: consumerEmail,
    consumerFirstName: consumerFirstName,
    consumerLastName: consumerLastName,
    consumerProfileImage: consumerProfileImage,
    createdAt: new Date().toISOString(),
    formattedDate: formattedDate,
  };

  return booking;
}

// update main order collection
function updateMainOrders(consumerID, booking) {
  db.collection("allOrders")
    .doc(consumerID)
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
function updatePhotographerOrders(photographerID, consumerID, booking) {
  db.collection("photographer")
    .doc(photographerID)
    .collection("orders")
    .doc(consumerID)
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
function updateUserOrders(consumerID, booking) {
  db.collection("users")
    .doc(consumerID)
    .collection("orders")
    .doc(consumerID)
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
function deleteFromOrders(consumerID) {
  db.collection("allOrders")
    .doc(consumerID)
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
function deleteFromPhotographers(photographerID, consumerID) {
  db.collection("photographer")
    .doc(photographerID)
    .collection("orders")
    .doc(consumerID)
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
function deleteFromUser(consumerID) {
  db.collection("users")
    .doc(consumerID)
    .collection("orders")
    .doc(consumerID)
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
