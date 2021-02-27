const functions = require("firebase-functions");
const cors = require("cors");
const helmet = require("helmet");
var cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const app = require("express")();
require("dotenv").config();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(helmet());
const sessionkey1 = process.env.session_key_one;
const sessionkey2 = process.env.session_key_two;
app.use(
  cookieSession({
    name: "session",
    keys: [sessionkey1, sessionkey2],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

const { admin, db, index } = require("./util/admin");
const payment = require("./handlers/payment");

// TODO: alternate to request.session due to memory leak
// TODO: find fix for raw-body limit, currently hard coded in C:\Users\nabee\AppData\Roaming\npm\node_modules\firebase-tools\node_modules\raw-body\index.js
const {
  getAllPhotographers,
  createPost,
  searchPhotographer,
  filterPhotographers,
  getSpecificPhotographer,
  checkBookAbility,
  getReviews,
  getPhotographerSchedule,
  getPricing,
  reviewPhotographer,
  editReview,
  deleteReview,
} = require("./handlers/posts");

const {
  signup,
  signupPhotographer,
  login,
  resetPassword,
  changePassword,
  uploadProfilePicture,
  uploadBackgroundPicture,
  uploadYourPhotographyImages,
  setYourPhotographyPage, //here
  updatePhotographerCategoriesAndBio,
  deleteImages,
  updateUserProfile,
  editBookingTimes,
  getUsersOrders,
  getUsersPastOrders,
  getUserReviews,
  getYourPhotographerPage,
  getYourPhotographerReviews,
  getYourUserProfile,
  getYourPhotographerOrders,
  getYourPhotographerPastOrders,
  verifyRegistration,
} = require("./handlers/users");

const {
  onboardUser,
  onboardUserRefresh,
  createPayment,
  getStripeOnboardStatus,
  refund,
  refundFromPhotographer,
} = require("./handlers/payment");

const { completedOrders } = require("./handlers/administrator");

const { webhooks } = require("./handlers/webhooks");

const {
  getVault,
  uploadToVault,
  deleteFromVault,
  downloadImages,
  getVaultSize,
  notifyCustomer,
  finalizeVault,
} = require("./handlers/vault");

const { testFunction } = require("./handlers/test");

const FBAuth = require("./util/FBAuth");

//--------User Routes-----------------
app.post("/signup", signup);
app.post("/signupPhotographer", signupPhotographer);
app.post("/login", login);
app.post("/resetPassword", resetPassword);
app.post("/changePassword", changePassword);

// get photographer details
app.get("/yourphotographerpage", FBAuth, getYourPhotographerPage);
app.get("/yourorders", FBAuth, getYourPhotographerOrders);
app.get("/yourpastorders", FBAuth, getYourPhotographerPastOrders);
app.get("/yourreviews", FBAuth, getYourPhotographerReviews);

// get user details
app.get("/youruserprofile", FBAuth, getYourUserProfile);
app.get("/youruserprofile/orders", FBAuth, getUsersOrders);
app.get("/youruserprofile/pastorders", FBAuth, getUsersPastOrders);
app.get("/youruserprofile/userReviews", FBAuth, getUserReviews);

// update user profile
app.post("/youruserprofile/edit", FBAuth, updateUserProfile);

// upload profile image
app.post("/user/profileimage", FBAuth, uploadProfilePicture);

// Stripe payments and setup
app.get("/onboard-status", FBAuth, getStripeOnboardStatus);
app.post("/onboard-user", FBAuth, onboardUser);
app.get("/onboard-user/refresh", FBAuth, onboardUserRefresh);
app.post("/photographers/:photographerId/book/checkout", FBAuth, createPayment);
app.post("/user/refund", FBAuth, refund);
app.post("/photographer/refund", FBAuth, refundFromPhotographer);

// photography page
app.post("/editphotographypage", FBAuth, setYourPhotographyPage);
app.post(
  "/editphotographypage/edit",
  FBAuth,
  updatePhotographerCategoriesAndBio
);
app.post("/editphotographypage/background", FBAuth, uploadBackgroundPicture);
app.post("/photographyimages", FBAuth, uploadYourPhotographyImages);
app.post("/photographyimages/delete", FBAuth, deleteImages);
app.post("/editphotographypage/bookingTimes", FBAuth, editBookingTimes);

//----------Consumer Routes---------------
app.get("/photographers", getAllPhotographers);
app.get("/photographers/:photographerId", getSpecificPhotographer);
app.get("/checkUserOrders", FBAuth, checkBookAbility);
app.post("/photographers/:photographerId/review", FBAuth, reviewPhotographer);
app.get("/photographers/:photographerId/getReviews", getReviews);
app.post("/userDashboard/editReview", FBAuth, editReview);
app.post("/userDashboard/deleteReview", FBAuth, deleteReview);
app.get("/photographers/:photographerId/bookingTimes", getPhotographerSchedule);
app.get("/search/:searchQuery", searchPhotographer);
app.get("/filter/:type/:city/:state", filterPhotographers);
app.get("/photographers/:photographerId/pricing", FBAuth, getPricing);

// Administrator
app.get("/admin/completedOrders", completedOrders);

// Webhooks for Stripe
app.post("/webhooks", webhooks);

// Vault routes
app.get("/vault/:vaultID", FBAuth, getVault);
app.post("/vault/:vaultID/upload", FBAuth, uploadToVault);
app.post("/vault/:vaultID/delete", FBAuth, deleteFromVault);
app.get("/vault/:vaultID/download", FBAuth, downloadImages);
app.get("/vault/:vaultID/getSize", FBAuth, getVaultSize);
app.get("/vault/:vaultID/notifyCustomer", FBAuth, notifyCustomer);
app.post("/vault/:vaultID/finalize", FBAuth, finalizeVault);

// Testing
app.post("/test", testFunction);

exports.dailyJob = functions.pubsub
  .schedule(`*/15 * * * *`)
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    db.collection("scheduler")
      .where("performAt", "<=", now)
      .where("status", "==", "scheduled")
      .get()
      .then(function (querySnapshot) {
        if (querySnapshot.size > 0) {
          querySnapshot.forEach(async function (doc) {
            payment.payOut(
              doc.id,
              doc.data().data.consumerID,
              doc.data().data.photographerID
            );
          });
          console.log("Job done");
        } else {
          console.log("No jobs to do");
        }
      })
      .catch((err) => {
        console.log("error in doing cronjob in payouts", err);
      });
  });

exports.updateAlgoliaIndex = functions.firestore
  .document("photographers/{userId}")
  .onUpdate((change, context) => {
    const object = change.after.data();
    object.objectID = context.params.userId;
    index
      .saveObject(object)
      .then(() => {
        console.log("Object saved in Algolia: ", object.objectID);
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });

exports.api = functions.https.onRequest(app);
