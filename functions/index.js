const functions = require("firebase-functions");

const app = require("express")();

const { getAllPhotographers, createPost } = require("./handlers/posts");

const {
  signup,
  login,
  uploadProfilePicture,
  addUserDetails,
  getYourPhotographerPage,
  getYourUserProfile
} = require("./handlers/users");

const FBAuth = require("./util/FBAuth");

// user routes
app.post("/signup", signup);
app.post("/login", login);
//app.post("/photographerprofile", FBAuth, addUserDetails);

// upload profile image
app.post("/user/image", FBAuth, uploadProfilePicture);

// posts routes
app.get("/posts", getAllPhotographers);
app.post("/posts", FBAuth, createPost);
// app.get('/photographers/:photographerId', getPhotographer)

// get photographer page and
app.get("/yourphotographerpage", FBAuth, getYourPhotographerPage);
app.get("/youruserprofile", FBAuth, getYourUserProfile);

exports.api = functions.https.onRequest(app);
