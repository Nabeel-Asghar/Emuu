import { React, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NavBarNoImage from "../NavbarPostLogin/NavBarNoImage.js";
import Paper from "@mui/material/Paper";
import "./register.scss";

function Register() {
  //use state for registration variables
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const history = useHistory();
  const [error, setError] = useState("");

  const userdata = {
    user_userName: userName,
    user_email: email,
    user_password: password,
  };
//validator to ensure password has more than 8 characters, an uppercase, and a special character
  const validatePassword = (pass) => {
    if (pass.length < 8) {
      setError("At least 8 characters");
      return false;
    }

    let uppercase = false;
    let specialChar = false;
    for (let i = 0; i < pass.length; i++) {
      if (pass[i].charCodeAt(0) >= 65 && pass[i].charCodeAt(0) <= 90)
        uppercase = true;
    }
    if (!uppercase) {
      setError("At least 1 uppercase letter");
      return false;
    }

    const format = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/

    if(format.test(pass)){
              specialChar = true;

    } else {
             specialChar = false;


    }

    if (!specialChar) {
      setError("At least 1 special character");
      return false;
    }

    return true;
  };
//validates email has format example@test.com
  function validateEmail(email) {
    let at = 0;
    let checkDotcom = "";
    for (let i = email.length - 1; i >= 0; i--) {
      if (email[i] == "@") at++;
      if (i >= email.length - 4) {
        checkDotcom += email[i];
      }
    }
//sets error message when email is not valid
    if (!(checkDotcom == "moc.") || !at || at > 1) {
      setError("The email address is invalid");
      return false;
    }

    return true;
  }
  function validateUsername(username){
    if(!username || username.length < 3){
     setError("The Username must be at least 3 letters long");
          return false;
    }


    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // store the states in the form data
    if (!validateEmail(userdata.user_email)) return;
    if (!validateUsername(userdata.user_userName)) return;

    if (!validatePassword(userdata.user_password)) return;
//sends user to login page


    //sends axios post to server of users registration info
    try{

     await axios
          .post(
            "https://emuu-cz5iycld7a-ue.a.run.app/auth/register",
            JSON.stringify(userdata)
          )

           history.push("/login");
    }catch(e){
        setError(e.response.data?.error||"Failed to register the User.")

    }

  };

  return (
    <>
      <NavBarNoImage />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={userName}
                placeholder="Username"
                onChange={(e) => setUserName(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                placeholder="Email Address"
                onChange={(e) => {
                  setError("");
                  setEmail(e.target.value);
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                placeholder="Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
              {!error && (
                <p style={{ color: "white" }}>
                  <small>
                    {" "}
                    <InfoOutlinedIcon />
                    Password must be at least 8 characters with 1 special
                    character and 1 uppercase character{" "}
                  </small>{" "}
                </p>
              )}
              {error && (
                <p style={{ color: "red" }}>
                  {" "}
                  <small>
                    {" "}
                    <ErrorOutlineIcon />
                    {error}
                  </small>
                </p>
              )}

              <Button
                onClick={(e) => handleSubmit(e)}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container>
                <Grid item>
                  <Link className="loginLink" href="/Login">
                    Already have an account? Log in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Register;
