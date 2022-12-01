import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import React, { useState } from "react";
import "./login.scss";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useHistory } from "react-router-dom";
import "../../Firebase.js";
import NavBarNoImage from "../NavbarPostLogin/NavBarNoImage.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const [error, setError] = useState("");
  //Sign in feature
  const handleSubmit = async (e) => {
    const auth = getAuth();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        localStorage.setItem("user", JSON.stringify(userCredential.user));
        localStorage.setItem("auth", true);

        localStorage.setItem("user", JSON.stringify(userCredential.user));
        localStorage.setItem("displayName", user.displayName);
        localStorage.setItem("userProfileImg", user.ProfilePictureUrl);
        localStorage.setItem("userEmail", email);
        history.push("/");
        window.location.reload();
      })
      .catch((error) => {
        const errorMessage = error.message;

        switch (errorMessage.split(")")[0].split("/")[1]) {
          case "invalid-email":
            setError(
              "The email or password entered do not match our existing records."
            );
            break;
          case "internal-error":
            setError("Both fields are required!");
            break;
          case "user-not-found":
            setError("User not found");
            break;
          case "wrong-password":
            setError(
              "The email or password entered do not match our existing records."
            );
            break;
          default:
            setError("An error occurred");
        }
      });
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
              Sign in
            </Typography>
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {!error && (
                <p>
                  <pre> </pre>
                </p>
              )}
              {error && (
                <p style={{ color: "red" }}>
                  <small>
                    <ErrorOutlineIcon />
                    {error}
                  </small>
                </p>
              )}
              <Button
                onClick={() => handleSubmit()}
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link className="registerLink" href="/Register">
                    Don't have an account? Sign Up
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
export default Login;
