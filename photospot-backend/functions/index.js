const functions = require("firebase-functions");
const cors = require("cors");
//const cron = require("node-cron");
const app = require("express")();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

const {
  getAllPhotographers,
  createPost,
  searchPhotographer,
  filterPhotographers,
  getSpecificPhotographer,
  bookPhotographer,
  getReviews,
  reviewPhotographer,
  getPhotographerSchedule,
  getPricing,
} = require("./handlers/posts");

const { getMessages, sendMessage } = require("./handlers/messages");

const {
  signup,
  login,
  uploadProfilePicture,
  uploadBackgroundPicture,
  uploadYourPhotographyImages,
  setYourPhotographyPage,
  setPhotographerCategories,
  updatePhotographerPage,
  getYourPhotographerPage,
  getYourUserProfile,
  chatMessaging,
  deleteImages,
  getUsersOrders,
  getUsersPastOrders,
  updateUserProfile,
  editBookingTimes,
  getYourPhotographerOrders,
  getYourPhotographerPastOrders,
} = require("./handlers/users");

const { completedOrders } = require("./handlers/administrator");

const FBAuth = require("./util/FBAuth");
//const { searchPhotographer } = require("../../photospot-client/src/redux/actions/dataActions");

//--------User Routes-----------------
app.post("/signup", signup);
app.post("/login", login);

// get photographer details
app.get("/yourphotographerpage", FBAuth, getYourPhotographerPage);
app.get("/yourorders", FBAuth, getYourPhotographerOrders);
app.get("/yourpastorders", FBAuth, getYourPhotographerPastOrders);

// get user details
app.get("/youruserprofile", FBAuth, getYourUserProfile);
app.get("/youruserprofile/orders", FBAuth, getUsersOrders);
app.get("/youruserprofile/pastorders", FBAuth, getUsersPastOrders);

// update user profile
app.post("/youruserprofile/edit", FBAuth, updateUserProfile);

// upload profile image
app.post("/user/profileimage", FBAuth, uploadProfilePicture);

// photography page
app.post("/editphotographypage", FBAuth, setYourPhotographyPage);
app.post(
  "/editphotographypage/editCategories",
  FBAuth,
  setPhotographerCategories
);
app.post("/editphotographypage/edit", FBAuth, updatePhotographerPage);
app.post("/editphotographypage/background", FBAuth, uploadBackgroundPicture);
app.post("/photographyimages", FBAuth, uploadYourPhotographyImages);
app.post("/photographyimages/delete", FBAuth, deleteImages);
app.post("/editphotographypage/bookingTimes", FBAuth, editBookingTimes);

// messaging ==========================================
app.get("/messages", FBAuth, getMessages);
app.post("/chats/:docKey", FBAuth, sendMessage);

//----------Consumer Routes---------------
app.get("/photographers", getAllPhotographers);
app.get("/photographers/:photographerId", getSpecificPhotographer);
app.post("/photographers/:photographerId/book", FBAuth, bookPhotographer);
app.post("/photographers/:photographerId/review", FBAuth, reviewPhotographer);
app.get("/photographers/:photographerId/getReviews", getReviews);
app.get(
  "/photographers/:photographerId/bookingTimes",
  FBAuth,
  getPhotographerSchedule
);
app.get("/search/:searchQuery", searchPhotographer);
app.get("/filter/:type/:city/:state", filterPhotographers);

app.get("/photographers/:photographerId/pricing", FBAuth, getPricing);

//Administrator
app.get("/admin/completedOrders", completedOrders);

exports.api = functions.https.onRequest(app);
