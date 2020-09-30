const sgMail = require("@sendgrid/mail");
const SendGridKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(SendGridKey);

// Email orders details out
const emailOrderDetails = (orderDetails) => {
  emailOrderToCustomer(orderDetails);
  emailOrderToPhotographer(orderDetails);
};

// If the refund is intiated by customers, send these emails
const emailRefundsByCustomer = (orderDetails) => {
  emailRefundToCustomerByCustomer(orderDetails);
  emailRefundToPhotographerByCustomer(orderDetails);
};

// If the refund is intiated by photographer, send these emails
const emailRefundsByPhotographer = (orderDetails) => {
  emailRefundToCustomerByPhotographer(orderDetails);
  emailRefundToPhotographerByPhotographer(orderDetails);
};

// Customer ordered refund
function emailRefundToCustomerByCustomer(orderDetails) {
  const msg = {
    to: orderDetails.consumerEmail,
    from: "PhotoSpot@photospot.site",
    templateId: "d-3b74ac26b55f416fa501a35b5f811279",
    dynamic_template_data: {
      consumerFirstName: orderDetails.consumerFirstName,
      photographerFirstName: orderDetails.photographerFirstName,
      photographerLastName: orderDetails.photographerLastName,
      shootDate: orderDetails.shootDate,
      shootTime: orderDetails.shootTime,
      amount: orderDetails.amount,
    },
  };
  sgMail.send(msg);
  console.log("Refund intiated by customer sent to customer");
}

function emailRefundToPhotographerByCustomer(orderDetails) {
  const msg = {
    to: orderDetails.photographerEmail,
    from: "PhotoSpot@photospot.site",
    templateId: "d-d38e871ea3ff4f399de583f204b57597",
    dynamic_template_data: {
      photographerFirstName: orderDetails.photographerFirstName,
      consumerFirstName: orderDetails.consumerFirstName,
      consumerLastName: orderDetails.consumerLastName,
      consumerEmail: orderDetails.consumerEmail,
      shootDate: orderDetails.shootDate,
      shootTime: orderDetails.shootTime,
      amount: orderDetails.amount,
    },
  };
  sgMail.send(msg);
  console.log("Refund intiated by customer sent to photographer");
}

// Order detials
function emailOrderToCustomer(orderDetails) {
  let url =
    "http://localhost:3000/photographers/" + orderDetails.photographerID;

  const msg = {
    to: orderDetails.consumerEmail,
    from: "PhotoSpot@photospot.site",
    templateId: "d-23bd9bd756d84529bf473e0c61d10d6f",
    dynamic_template_data: {
      consumerFirstName: orderDetails.consumerFirstName,
      photographerFirstName: orderDetails.photographerFirstName,
      photographerLastName: orderDetails.photographerLastName,
      shootDate: orderDetails.shootDate,
      shootTime: orderDetails.shootTime,
      amount: orderDetails.amount,
      link: url,
    },
  };
  sgMail.send(msg);
  console.log("Email sent to customer!");
}

function emailOrderToPhotographer(orderDetails) {
  const msg = {
    to: orderDetails.photographerEmail,
    from: "PhotoSpot@photospot.site",
    templateId: "d-67acb98bb80d43179cee8067613312eb",
    dynamic_template_data: {
      photographerFirstName: orderDetails.photographerFirstName,
      consumerFirstName: orderDetails.consumerFirstName,
      consumerLastName: orderDetails.consumerLastName,
      consumerEmail: orderDetails.consumerEmail,
      shootDate: orderDetails.shootDate,
      shootTime: orderDetails.shootTime,
      amount: orderDetails.amount,
    },
  };
  sgMail.send(msg);
  console.log("Email sent to photographer!");
}

// Photographer ordered refund
function emailRefundToCustomerByPhotographer(orderDetails) {
  const msg = {
    to: orderDetails.consumerEmail,
    from: "PhotoSpot@photospot.site",
    templateId: "d-520081520a0f4d8fb24e4b3a4bed3cc1",
    dynamic_template_data: {
      consumerFirstName: orderDetails.consumerFirstName,
      photographerFirstName: orderDetails.photographerFirstName,
      photographerLastName: orderDetails.photographerLastName,
      shootDate: orderDetails.shootDate,
      shootTime: orderDetails.shootTime,
      amount: orderDetails.amount,
    },
  };
  sgMail.send(msg);
  console.log("Refund intiated by photographer sent to customer");
}

function emailRefundToPhotographerByPhotographer(orderDetails) {
  const msg = {
    to: orderDetails.photographerEmail,
    from: "PhotoSpot@photospot.site",
    templateId: "d-03d20741d46b4b558839d55928872691",
    dynamic_template_data: {
      photographerFirstName: orderDetails.photographerFirstName,
      consumerFirstName: orderDetails.consumerFirstName,
      consumerLastName: orderDetails.consumerLastName,
      consumerEmail: orderDetails.consumerEmail,
      shootDate: orderDetails.shootDate,
      shootTime: orderDetails.shootTime,
      amount: orderDetails.amount,
    },
  };
  sgMail.send(msg);
  console.log("Refund intiated by photographer sent to photographer");
}

exports.emailOrderDetails = emailOrderDetails;
exports.emailRefundsByCustomer = emailRefundsByCustomer;
exports.emailRefundsByPhotographer = emailRefundsByPhotographer;
