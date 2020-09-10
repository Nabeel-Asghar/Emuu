const { admin, db } = require("../util/admin");
const dotenv = require("dotenv");

dotenv.config();
const payment__webhook_secret = process.env.payment_signing_secret;

// Email functions
const email = require("./email");

exports.paymentHook = (req, res) => {
  let event = req.body;

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("Successful Payment");
      handleSuccessfulPaymentIntent(event.data.object.metadata);
  }

  return res.status(200).end();
};

function handleSuccessfulPaymentIntent(orderDetails) {
  console.log("order details: ", orderDetails);

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

  // update main collection of orders with this order
  db.collection("allOrders")
    .doc()
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
            .doc()
            .set(booking)
            .then(() => {
              // Set order for user under users/{user ID}/orders
              db.collection("users")
                .doc(consumerID)
                .collection("orders")
                .doc(photographerID)
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
