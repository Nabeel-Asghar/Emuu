import { createTheme, ThemeProvider } from "@mui/material/styles";
import {React, useState, Component} from 'react'
import axios from 'axios';
import Login from './LoginScreen'
import {Routes, Route, useHistory} from 'react-router-dom';


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

function Register() {

  //use state for registration variables
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const[password, setPassword] = useState("")
  const[email,setEmail] = useState("")
  const[userName, setUserName] = useState("")
  const[message, setMessage] = useState("")
  const history = useHistory()

const userdata = { user_firstName:firstName,user_lastName:lastName,user_userName:userName,user_email:email,user_password:password}

const handleSubmit = async(e) => {
  // store the states in the form data

    history.push('/login')
   await axios.post('http://localhost:8080/auth/register', JSON.stringify(userdata))
    .then(result=>{
    console.log("User is registered");


   });

}




  //registration form
  return (


    <ThemeProvider theme={theme}>



      <h1>Register</h1>
       <form id="registerForm" method="POST" class="was-validated">

        {/*First Name */}
       <div className="col-sm-6 offset-sm-3">
       <input type= "text" value = {firstName} onChange ={(e) =>setFirstName(e.target.value)} className= "form-control" placeholder = "First Name" required />
       <div class="valid-feedback">Valid.</div>
       <div class="invalid-feedback">Please fill out this field.</div>
       </div>
       <br />

        {/*Last Name */}
       <div className="col-sm-6 offset-sm-3">
       <input type= "text" value = {lastName} onChange ={(e) =>setLastName(e.target.value)} className= "form-control" placeholder = "Last Name" required/>
       <div class="valid-feedback">Valid.</div>
       <div class="invalid-feedback">Please fill out this field.</div>
       </div>
       <br />

        {/*User Name */}
       <div className="col-sm-6 offset-sm-3">
       <input type= "text" value = {userName} onChange ={(e) =>setUserName(e.target.value)} className= "form-control" placeholder = "User Name" required/>
       <div class="valid-feedback">Valid.</div>
       <div class="invalid-feedback">Please fill out this field.</div>
       </div>
       <br />

        {/*Email */}
       <div className="col-sm-6 offset-sm-3">
       <input type= "text" value = {email} onChange ={(e) =>setEmail(e.target.value)} className= "form-control" placeholder = "Email Address" required/>
       <div class="valid-feedback">Valid.</div>
       <div class="invalid-feedback">Please fill out this field.</div>
       </div>
       <br />

        {/*Password */}
       <div className="col-sm-6 offset-sm-3">
       <input type= "password" value = {password} onChange ={(e) =>setPassword(e.target.value)} className= "form-control" placeholder = "Password" required/>
       <div class="valid-feedback">Valid.</div>
       <div class="invalid-feedback">Please fill out this field.</div>
       </div>
       <br />


       </form>


       <button onClick={()=>handleSubmit()} type="submit" className="btn me-4 btn-dark btn-lg">Register</button>


    </ThemeProvider>
  );
}

export default Register;