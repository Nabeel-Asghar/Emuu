import firebase from "firebase";

// Dev
export const algoliaCred = {
  appID: "SYUBAMS440",
  searchKey: "587bf2e2211c20cdb452ed974fbd6b77",
};

// Prod
// export const algoliaCred = {
//   appID: "0DD6KACKWW",
//   searchKey: "475682dfe88313f60e4da316bbd01742",
// };

// Dev
const config = {
  apiKey: "AIzaSyAY_hC7Jjg3N8hsNZzp-8TzdedxpqcHOds",
  authDomain: "photospot-dev-b174a.firebaseapp.com",
  projectId: "photospot-dev-b174a",
  storageBucket: "photospot-dev-b174a.appspot.com",
  messagingSenderId: "458864535144",
  appId: "1:458864535144:web:0d71202acbde79076c3ddd",
  measurementId: "G-1VFRQT634Y",
};

// Prod
// const config = {
//   apiKey: "AIzaSyA3fvrnPCpwgyqaRSvylay5aeyM57h1IJA",
//   authDomain: "photospot-5f554.firebaseapp.com",
//   databaseURL: "https://photospot-5f554.firebaseio.com",
//   projectId: "photospot-5f554",
//   storageBucket: "photospot-5f554.appspot.com",
//   messagingSenderId: "379618039684",
//   appId: "1:379618039684:web:0bcdd297aaf8d3b65f6fd1",
//   measurementId: "G-FSEHN9YLHE",
//   photoVault: "photospot_photo_vault",
// };

firebase.initializeApp(config);

export { firebase };
