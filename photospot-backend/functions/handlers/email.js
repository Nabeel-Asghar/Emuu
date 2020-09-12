const sgMail = require("@sendgrid/mail");
const SendGridKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(SendGridKey);

const emailOrderDetails = (orderDetails) => {
  emailToCustomer(orderDetails);
  emailToPhotographer(orderDetails);
};

function emailToCustomer(orderDetails) {
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

function emailToPhotographer(orderDetails) {
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
    },
  };
  sgMail.send(msg);
  console.log("Email sent to photographer!");
}

exports.emailOrderDetails = emailOrderDetails;
