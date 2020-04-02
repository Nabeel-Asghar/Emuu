const functions = require("firebase-functions");

const app = require("express")();

const { getAllPosts, createPost } = require("./handlers/posts");

const {
  signup,
  login,
  uploadProfilePicture,
  addUserDetails
} = require("./handlers/users");

const FBAuth = require("./util/FBAuth");

// user routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/photographerprofile", FBAuth, addUserDetails);

// upload profile image
app.post("/user/image", FBAuth, uploadProfilePicture);

// posts routes
app.get("/posts", getAllPosts);
app.post("/posts", FBAuth, createPost);
// app.get('/photographers/:photographerId', getPhotographer)

exports.api = functions.https.onRequest(app);
