import { createTheme, ThemeProvider } from "@mui/material/styles";
import { React, useState, Component } from "react";
import axios from "axios";
import Login from "./newloginscreen";
import { Routes, Route, useHistory } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
const theme = createTheme();

function Register() {
  //use state for registration variables
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const history = useHistory();
  const [error, setError] = useState("");

  const userdata = {
    user_userName: userName,
    user_email: email,
    user_password: password,
  };

  const videoCollectionData = {};

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
    for (let i = 0; i < pass.length; i++) {
      if (pass[i].charCodeAt(0) >= 33 && pass[i].charCodeAt(0) <= 64)
        specialChar = true;
    }
    if (!specialChar) {
      setError("At least 1 special character");
      return false;
    }

    return true;
  };

  function validateEmail(email) {
    let at = 0;
    let checkDotcom = "";
    for (let i = email.length - 1; i >= 0; i--) {
      if (email[i] == "@") at++;
      if (i >= email.length - 4) {
        checkDotcom += email[i];
      }
    }
    console.log(checkDotcom);

    if (!(checkDotcom == "moc.") || !at || at>1) {
      setError("The email address is invalid");
      return false;
    }

    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // store the states in the form data
    if (!validateEmail(userdata.user_email)) return;
    if (!validatePassword(userdata.user_password)) return;

    history.push("/login");
    await axios
      .post("http://localhost:8080/auth/register", JSON.stringify(userdata))
      .then((result) => {
        console.log("User is registered");
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
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
          <Box component="form" sx={{ mt: 3 }}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <input
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  value={userName}
                  className="register-input"
                  placeholder="Username"
                  onChange={(e) => setUserName(e.target.value)}
                />
                <Grid item xs={12}>
                  <input
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    className="register-input"
                    placeholder="Email Address"
                    onChange={(e) => {
                      setError("");
                      setEmail(e.target.value);
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <input
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    className="register-input"
                    placeholder="Password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                  />
                  {!error && (
                    <p style={{ color: "black", margin: "0" }}>
                      <small>
                        {" "}
                        <InfoOutlinedIcon />
                        Password must be at least 8 characters with 1 special
                        character and 1 uppercase character{" "}
                      </small>{" "}
                    </p>
                  )}
                  {error && (
                    <p style={{ color: "red", margin: "0" }}>
                      {" "}
                      <small>
                        {" "}
                        <ErrorOutlineIcon />
                        {error}
                      </small>
                    </p>
                  )}
                </Grid>
              </Grid>
              <Button
                onClick={(e) => handleSubmit(e)}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/Login" variant="body2">
                    Already have an account? Log in
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Register;
