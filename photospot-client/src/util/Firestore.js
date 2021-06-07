import firebase from "firebase";

const prod_Config = {
  apiKey: "AIzaSyA3fvrnPCpwgyqaRSvylay5aeyM57h1IJA",
  authDomain: "photospot-5f554.firebaseapp.com",
  databaseURL: "https://photospot-5f554.firebaseio.com",
  projectId: "photospot-5f554",
  storageBucket: "photospot-5f554.appspot.com",
  messagingSenderId: "379618039684",
  appId: "1:379618039684:web:0bcdd297aaf8d3b65f6fd1",
  measurementId: "G-FSEHN9YLHE",
  photoVault: "photospot_photo_vault",
};

const dev_config = {
  apiKey: "AIzaSyAY_hC7Jjg3N8hsNZzp-8TzdedxpqcHOds",
  authDomain: "photospot-dev-b174a.firebaseapp.com",
  projectId: "photospot-dev-b174a",
  storageBucket: "photospot-dev-b174a.appspot.com",
  messagingSenderId: "458864535144",
  appId: "1:458864535144:web:0d71202acbde79076c3ddd",
  measurementId: "G-1VFRQT634Y",
};

firebase.initializeApp(dev_config);

export { firebase };
