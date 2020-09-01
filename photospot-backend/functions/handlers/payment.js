const dotenv = require("dotenv");
dotenv.config();

const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
const stripePrivateKey = process.env.STRIPE_PRIVATE_KEY;

const stripe = require("stripe")(stripePrivateKey);

exports.onboardUser = async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      type: "express",
    });
    req.session.accountID = account.id;

    const origin = "http://localhost:3000/";
    const accountLinkURL = await generateAccountLink(account.id, origin);
    return res.json({ url: accountLinkURL });
  } catch (err) {
    console.log("stripe error: ", err.message);
    return res.status(500).json({ error: err.message });
  }
};

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
