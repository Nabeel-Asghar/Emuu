const functions = require("firebase-functions");

const app = require("express")();

const {
  getAllPhotographers,
  createPost,
  getSpecificPhotographer,
  bookPhotographer,
} = require("./handlers/posts");

const {
  signup,
  login,
  uploadProfilePicture,
  uploadYourPhotographyImages,
  setYourPhotographyPage,
  getYourPhotographerPage,
  getYourUserProfile,
} = require("./handlers/users");

const FBAuth = require("./util/FBAuth");

//--------User Routes-----------------
app.post("/signup", signup);
app.post("/login", login);

// get photographer page or user page
app.get("/yourphotographerpage", FBAuth, getYourPhotographerPage);
app.get("/youruserprofile", FBAuth, getYourUserProfile);

// upload profile image
app.post("/user/profileimage", FBAuth, uploadProfilePicture);

// create photography page
app.post("/editphotographypage", FBAuth, setYourPhotographyPage);

// upload images for your page
app.post("/photographyimages", FBAuth, uploadYourPhotographyImages);

//----------Consumer Routes---------------
app.get("/photographers", getAllPhotographers);
app.get("/photographers/:photographerId", getSpecificPhotographer);
app.post("/photographers/:photographerId/book", bookPhotographer);

exports.api = functions.https.onRequest(app);
