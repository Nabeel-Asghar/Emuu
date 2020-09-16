const { admin, db } = require("../util/admin");
const dotenv = require("dotenv");

dotenv.config();
const payment__webhook_secret = process.env.payment_signing_secret;

// Email functions
const email = require("./email");

exports.webhooks = (req, res) => {
  let event = req.body;

  switch (event.type) {
    case "payment_intent.succeeded":
      console.log("Successful Payment");
      handleSuccessfulPaymentIntent(
        event.data.object.metadata,
        event.data.object.amount,
        event.data.object.id
      );
      break;

    case "charge.refunded":
      console.log("Refund Successful");
      handleRefund(
        event.data.object.metadata,
        event.data.object.amount,
        event.data.object.id
      );
      break;
  }

  return res.status(200).end();
};

function handleRefund(orderDetails, chargeAmount, paymentID) {
  let photographerID = orderDetails.photographerID;
  let consumerID = orderDetails.consumerID;
  let shootDate = orderDetails.date;
  let shootTime = orderDetails.time;

  let booking = bookingObject(orderDetails, chargeAmount, paymentID);

  // delete from main collection
  db.collection("allOrders")
    .doc(consumerID)
    .delete()
    .then(() => {
      // delete from photographer
      db.collection("photographer")
        .doc(photographerID)
        .collection("orders")
        .doc(consumerID)
        .delete()
        .then(() => {
          // delete from user
          db.collection("users")
            .doc(consumerID)
            .collection("orders")
            .doc(consumerID)
            .delete()
            .then(() => {
              // update timeslot for photographer
              db.collection("photographer")
                .doc(photographerID)
                .collection("bookings")
                .doc(shootDate)
                .update({
                  [shootTime]: false,
                })
                .then(() => {
                  email.emailRefunds(booking);
                  return true;
                })
                .catch((err) => {
                  console.log("update timeslot for photographer", err);
                  return false;
                });
            })
            .catch((err) => {
              console.log("delete from user", err);
              return false;
            });
        })
        .catch((err) => {
          console.log("delete from photographer", err);
          return false;
        });
    })
    .catch((err) => {
      console.log("delete from main collection", err);
      return false;
    });
}

function handleSuccessfulPaymentIntent(orderDetails, chargeAmount, paymentID) {
  let shootDate = orderDetails.date;
  let shootTime = orderDetails.time;
  let photographerID = orderDetails.photographerID;
  let consumerID = orderDetails.consumerID;

  let booking = bookingObject(orderDetails, chargeAmount, paymentID);

  // update main collection of orders with this order
  db.collection("allOrders")
    .doc(consumerID)
    .set(booking)
    .then(() => {
      // Update booking time to be filled on photographer schedule
      db.collection("photographer")
        .doc(photographerID)
        .collection("bookings")
        .doc(shootDate)
        .update({
          [shootTime]: true,
        })
        .then(() => {
          // Set order for photographer under photographer/{photograhper ID}/orders
          db.collection("photographer")
            .doc(photographerID)
            .collection("orders")
            .doc(consumerID)
            .set(booking)
            .then(() => {
              // Set order for user under users/{user ID}/orders
              db.collection("users")
                .doc(consumerID)
                .collection("orders")
                .doc(consumerID)
                .set(booking)
                .then(() => {
                  email.emailOrderDetails(booking);
                  return true;
                })
                .catch((err) => {
                  console.log(err);
                  return false;
                });
            })
            .catch((err) => {
              console.log(err);
              return false;
            });
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
}

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
