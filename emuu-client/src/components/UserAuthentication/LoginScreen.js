import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, {useState, useEffect} from 'react'

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

  return (
    <ThemeProvider theme={theme}>
       <div className="col-sm-6 offset-sm-3">

      <h1>Login</h1>
     <input type= "text" onChange ={(e) =>setEmail(e.target.value)} className= "form-control" placeholder = "Email" />
        <br />
      <input type= "password" onChange ={(e) =>setPassword(e.target.value)} className= "form-control" placeholder = "Password" />
        <br />
        <button className = "btn btn-primary"> Login </button>

      </div>
    </ThemeProvider>
  );
}

export default Login;