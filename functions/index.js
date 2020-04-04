const functions = require("firebase-functions");

const app = require("express")();

const {
  getAllPhotographers,
  createPost,
  getSpecificPhotographer,
} = require("./handlers/posts");

const {
  signup,
  login,
  uploadProfilePicture,
  setYourPhotographyPage,
  getYourPhotographerPage,
  getYourUserProfile,
} = require("./handlers/users");

const FBAuth = require("./util/FBAuth");

//--------User Routes-----------------
app.post("/signup", signup);
app.post("/login", login);

// upload profile image
app.post("/user/image", FBAuth, uploadProfilePicture);

// create photography page
app.post("/editphotographypage", FBAuth, setYourPhotographyPage);

// TODO: app.post("/photographyimages", FBAuth, uploadYourPhotographyImages)

// get photographer page and
app.get("/yourphotographerpage", FBAuth, getYourPhotographerPage);
// TODO: app.get("/youruserprofile", FBAuth, getYourUserProfile);

//----------Consumer Routes---------------

// getting all photographers and picking one
app.get("/photographers", getAllPhotographers);
app.get("/photographers/:photographerId", getSpecificPhotographer);

exports.api = functions.https.onRequest(app);
