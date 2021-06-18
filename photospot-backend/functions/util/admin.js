const admin = require("firebase-admin");

const functions = require("firebase-functions");
const serviceAccount =
  functions.config().app.environment === "dev"
    ? require("../keys/admin.dev.json")
    : require("../keys/admin.prod.json.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://photospot-5f554.firebaseio.com",
});

const algoliasearch = require("algoliasearch");

const db = admin.firestore();
const db2 = admin.firestore;

const storage = admin.storage();

const APP_ID = functions.config().algolia.id;
const ADMIN_KEY = functions.config().algolia.key;

console.log("Algolia:", APP_ID, "", ADMIN_KEY);

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex("photographers");

module.exports = { admin, db, db2, index, storage };
