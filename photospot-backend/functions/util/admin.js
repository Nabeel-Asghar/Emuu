const admin = require("firebase-admin");

var serviceAccount = require("../keys/admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://photospot-5f554.firebaseio.com",
});

const db = admin.firestore();
const db2 = admin.firestore;

module.exports = { admin, db, db2 };
