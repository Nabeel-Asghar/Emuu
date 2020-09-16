const sgMail = require("@sendgrid/mail");
const SendGridKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(SendGridKey);

const emailOrderDetails = (orderDetails) => {
  emailOrderToCustomer(orderDetails);
  emailOrderToPhotographer(orderDetails);
};

const emailRefund = (orderDetails) => {
  emailRefundToCustomer(orderDetails);
  emailRefundToPhotographer(orderDetails);
};

function emailRefundToCustomer(orderDetails) {
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
  console.log("Refund sent to customer");
}

function emailRefundToPhotographer(orderDetails) {
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
  console.log("Refund sent to photographer");
}

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

exports.emailOrderDetails = emailOrderDetails;
exports.emailRefunds = emailRefund;
