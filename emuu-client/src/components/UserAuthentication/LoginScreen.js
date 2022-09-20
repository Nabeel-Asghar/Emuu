import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, {useState, useEffect} from 'react'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {Routes, Route, useHistory} from 'react-router-dom';
import Home from '../home/Home'
import "../../Firebase.js"


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
const history = useHistory()

  const handleSubmit = async(e) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("User is signed in");
        history.push('/home')
        // ...
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
               <button onClick={()=>handleSubmit()} type="submit" button class="btn me-4 btn-dark btn-lg">Sign In</button>
                <a class="btn btn-dark btn-lg" href="/Register" role = "button">Sign Up</a>
             </div>
        </div>

      </div>
    </ThemeProvider>
  );
}

export default Login;