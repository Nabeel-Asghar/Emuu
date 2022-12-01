import { React, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import NavBarNoSearch from "../NavbarPostLogin/NavBarNoSearch.js";
import { getAuth, signOut } from "firebase/auth";
import "../../Firebase.js";
import "./register.scss";
import "./Settings.scss";

function Settings() {
  //use state for registration variables
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const history = useHistory();
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // store the states in the form data
    if (!validatePassword(newPassword)) return;
    const auth = getAuth();
    console.log({ newPassword, uid: auth.currentUser.uid });

    await axios
      .post("http://localhost:8080/auth/settings", {
        newPassword,
        uid: auth.currentUser.uid,
      })
      .then((result) => {
        if (result.data) {
          alert("Successfully Updated Password");

          signOut(auth)
            .then(() => {
              localStorage.setItem("auth", false);
              localStorage.setItem("user", null);
              localStorage.setItem("displayName", null);
              history.push("/login");
            })
            .catch((e) => alert(e.message));
        }
      })
      .catch((e) => alert(e.message));
  };

  return (
    <>
      <NavBarNoSearch />
      <Container className="settingsContainer" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "#0072FF" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
          <Box component="form" sx={{ mt: 3 }}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Current Password"
                  type="password"
                  id="password"
                  autoComplete="password"
                  value={password}
                  className="register-input"
                  placeholder="Current Password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="newpassword"
                    label="New Password"
                    type="password"
                    id="newpassword"
                    autoComplete="new-password"
                    value={newPassword}
                    className="register-input"
                    placeholder="New Password"
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError("");
                    }}
                  />
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Confirm New Password"
                      type="password"
                      value={confirmNewPassword}
                      autoComplete="password"
                      className="register-input"
                      placeholder="Confirm New Password"
                      onChange={(e) => {
                        setConfirmNewPassword(e.target.value);
                      }}
                    />
                    {!error && (
                      <p>
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
              </Grid>
              <Button
                onClick={(e) => handleSubmit(e)}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Change Password
              </Button>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default Settings;
