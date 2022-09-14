import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, {useState} from 'react'
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


  //logs registration inputs
  const handleSubmit  = () => {
          console.log(firstName,lastName,userName,email,password);
      }
  //registration form
  return (


    <ThemeProvider theme={theme}>

      <div className="col-sm-6 offset-sm-3">

      <h1>Register</h1>

       <input type= "text" value = {firstName} onChange ={(e) =>setFirstName(e.target.value)} className= "form-control" placeholder = "First Name" />
       <br />
       <input type= "text" value = {lastName} onChange ={(e) =>setLastName(e.target.value)} className= "form-control" placeholder = "Last Name" />
       <br />
       <input type= "text" value = {userName} onChange ={(e) =>setUserName(e.target.value)} className= "form-control" placeholder = "User Name" />
       <br />
       <input type= "text" value = {email} onChange ={(e) =>setEmail(e.target.value)} className= "form-control" placeholder = "Email Address" />
       <br />
       <input type= "password" value = {password} onChange ={(e) =>setPassword(e.target.value)} className= "form-control" placeholder = "Password" />
       <br />


       <button onClick={()=>handleSubmit()} type="submit" className="btn btn-primary">Register</button>
            </div>

    </ThemeProvider>
  );
}

export default Register;