const sgMail = require("@sendgrid/mail");
const SendGridKey = process.env.SENDGRID_API_KEY;

sgMail.setApiKey(SendGridKey);

const emailOrderDetails = (orderDetails) => {
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
      link: url,
    },
  };
  sgMail.send(msg);
  console.log("email sent!");
};

exports.emailOrderDetails = emailOrderDetails;
