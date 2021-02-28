const admin = require("firebase-admin");

var serviceAccount = require("../keys/admin.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://photospot-5f554.firebaseio.com",
});

const functions = require("firebase-functions");
const algoliasearch = require("algoliasearch");

const db = admin.firestore();
const db2 = admin.firestore;

const storage = admin.storage();

const APP_ID = "SYUBAMS440";
const ADMIN_KEY = "441365132c4d965b7da318d6c8439c18";

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex("photographers");

module.exports = { admin, db, db2, index, storage };
