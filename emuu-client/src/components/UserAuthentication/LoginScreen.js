import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, {useState, useEffect} from 'react'
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, getIdToken } from "firebase/auth";
import {Routes, Route, useHistory} from 'react-router-dom';
import Home from '../home/Home'
import "../../Firebase.js"

//import firebase from 'firebase/compat/app';
import firebase from 'firebase/app';
//import testUserStatus from './UserStatus'
import axios from 'axios';
import HeaderPostLogin from '../NavbarPostLogin/HeaderPostLogin'
import app from "../../Firebase.js"


const theme = createTheme({
  palette: {
    primary: {
      light: "#484848",
      main: "#212121",
      dark: "#000000",
      contrastText: "#fff",
    },
    secondary: {
      light: "#6bffff",
      main: "#0be9d0",
      dark: "#00b69f",
      contrastText: "#000",
    },
  },
});
function Login() {



 const[email, setEmail] = useState("")
 const[password, setPassword] = useState("")
 let token = ""
 const history = useHistory()

 const auth = getAuth();




//Sign in feature
  const SignIn = async(e) => {

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in

        console.log("User is signed in");

        history.push('/home')

//         app.auth().currentUser.getToken().then(function(token){
//           console.log(token);
//         });

        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Invalid User Credentials");
      });

  }


  return (
    <ThemeProvider theme={theme}>
       <div className="col-sm-6 offset-sm-3">

      <h1>Login</h1>
     <input type= "text" onChange ={(e) =>setEmail(e.target.value)} className= "form-control" placeholder = "Email" />
        <br />
      <input type= "password" onChange ={(e) =>setPassword(e.target.value)} className= "form-control" placeholder = "Password" />
        <br />


        <div class="row">
            <div class="col-sm-12 text-center">
               <button onClick={()=>SignIn()} type="submit" button class="btn me-4 btn-dark btn-lg">Sign In</button>
                <a class="btn btn-dark btn-lg" href="/Register" role = "button">Sign Up</a>
             </div>
        </div>

      </div>
    </ThemeProvider>
  );
}

export default Login;
