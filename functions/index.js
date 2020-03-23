const functions = require("firebase-functions");

const app = require("express")();

const { getAllPosts, createPost } = require("./handlers/posts");

const { signup, login, uploadProfilePicture } = require("./handlers/users");

const FBAuth = require("./util/FBAuth");

// posts routes
app.get("/posts", getAllPosts);
app.post("/posts", FBAuth, createPost);

// signup and login
app.post("/signup", signup);
app.post("/login", login);

// upload profile image
app.post("/user/image", FBAuth, uploadProfilePicture);

exports.api = functions.https.onRequest(app);
