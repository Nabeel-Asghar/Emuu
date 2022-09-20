// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyPlEaPQBx8RQZtzFXDb26-hHK_OvOTHg",
  authDomain: "emuu-1ee85.firebaseapp.com",
  databaseURL: "https://emuu-1ee85-default-rtdb.firebaseio.com",
  projectId: "emuu-1ee85",
  storageBucket: "emuu-1ee85.appspot.com",
  messagingSenderId: "683280790109",
  appId: "1:683280790109:web:a0127221c86d47224d13b4",
  measurementId: "G-WLHXZLJM0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
