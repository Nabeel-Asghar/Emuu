const functions = require("firebase-functions");

const app = require("express")();

const { getAllPosts, createPost } = require("./handlers/posts");

const { signup, login } = require("./handlers/users");

const FBAuth = require("./util/FBAuth");

// posts routes
app.get("/posts", FBAuth, getAllPosts);
app.post("/posts", FBAuth, createPost);

// signup and login
app.post("/signup", signup);
app.post("/login", login);

exports.api = functions.https.onRequest(app);
