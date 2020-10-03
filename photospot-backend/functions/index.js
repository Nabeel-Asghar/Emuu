const functions = require("firebase-functions");
const cors = require("cors");
const { index } = require("../util/admin");
//const helmet = require("helmet");

const app = require("express")();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
//app.use(helmet());

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
  editReview,
  deleteReview,
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
  getYourPhotographerReviews,
  getYourUserProfile,
  resetPassword,
  changePassword,
  deleteImages,
  getUsersOrders,
  getUsersPastOrders,
  getUserReviews,
  updateUserProfile,
  editBookingTimes,
  getYourPhotographerOrders,
  getYourPhotographerPastOrders,
  addFirestoreDataToAlgolia,
} = require("./handlers/users");

const { completedOrders } = require("./handlers/administrator");

const FBAuth = require("./util/FBAuth");
//const { searchPhotographer } = require("../../photospot-client/src/redux/actions/dataActions");

//--------User Routes-----------------
app.post("/signup", signup);
app.post("/login", login);
app.post("/resetPassword", resetPassword);
app.post("/changePassword", changePassword);

// get photographer details
app.get("/yourphotographerpage", FBAuth, getYourPhotographerPage);
app.get("/yourorders", FBAuth, getYourPhotographerOrders);
app.get("/yourpastorders", FBAuth, getYourPhotographerPastOrders);
app.get("/yourreviews", FBAuth, getYourPhotographerReviews);
app.get("/addFirestoreDataToAlgolia", FBAuth, addFirestoreDataToAlgolia);

// get user details
app.get("/youruserprofile", FBAuth, getYourUserProfile);
app.get("/youruserprofile/orders", FBAuth, getUsersOrders);
app.get("/youruserprofile/pastorders", FBAuth, getUsersPastOrders);
app.get("/youruserprofile/userReviews", FBAuth, getUserReviews);

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
app.post("/userDashboard/editReview", FBAuth, editReview);
app.post("/userDashboard/deleteReview", FBAuth, deleteReview);
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

exports.onReviewCreated = functions.firestore
  .document("photographer/{photographerID}/reviews/{reviewID}")
  .onCreate((snap, context) => {
    // Get the note document
    const note = snap.data();

    // Add an 'objectID' field which Algolia requires
    note.objectID = context.params.reviewID;

    // Write to the algolia index
    return index.saveObject(note);
  });

exports.onReviewUpdate = functions.firestore
  .document("photographer/{photographerID}/reviews/{reviewID}")
  .onUpdate((snap, context) => {
    // Get the note document
    const note = snap.data();

    // Add an 'objectID' field which Algolia requires
    note.objectID = context.params.reviewID;

    // Write to the algolia index
    return index.saveObject(note);
  });

exports.onUserCreated = functions.firestore
  .document("photographer/{photographerID}")
  .onCreate((snap, context) => {
    // Get the note document
    const note = snap.data();

    // Add an 'objectID' field which Algolia requires
    note.objectID = context.params.photographerID;

    // Write to the algolia index
    return index.saveObject(note);
  });

exports.api = functions.https.onRequest(app);
