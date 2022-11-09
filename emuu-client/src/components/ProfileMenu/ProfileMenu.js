import "./ProfileMenu.scss";

import * as React from "react";
import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import LoginIcon from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import { useHistory, Link } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { collection, getDoc, where, doc } from "firebase/firestore";
import { db } from "../../Firebase.js";
import AppContext from "../../AppContext";

export default function AccountMenu() {
  const userName = localStorage.getItem("displayName");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const isMenuOpen = useContext(AppContext).isMenuOpen;
  const profileImage = localStorage.getItem("userImage");

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //Sign Out Function in Nav Bar
  const history = useHistory();
  const auth = getAuth;

  const navAuth = localStorage.getItem("auth");
  let userFirstInitial;

  if (auth === true) {
    userFirstInitial = localStorage
      .getItem("displayName")
      .charAt(0)
      .toUpperCase();
  }

  const SignedOut = async (e) => {
    signOut(auth)
      .then(() => {
        console.log("User is signed out");
        history.push("/");
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  return (

    <AppContext.Consumer>
      {(context) =>
        navAuth === "true" ? (
          <>
            <Box sx={{ display: "flex", flexDirection: "column", zIndex: "9" }}>
              <IconButton
                onClick={() => context.toggleMenuState()}

                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >

                <Avatar
                  sx={
                    isMenuOpen === true
                      ? {
                          width: 40,
                          height: 40,
                          marginRight: "-132.5px !important",
                        }
                      : { width: 40, height: 40 }
                  }
                >
                  {userFirstInitial}
                </Avatar>
              </IconButton>

              <div
                style={{
                  display: isMenuOpen === false && "none",
                  height: "0px",
                  width: "200px",
                  paddingTop: "0px",
                  background: "red !important",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "white",
                    borderTopLeftRadius: "20px",
                    borderTopRightRadius: "15px",
                    border: "1px solid gray",
                    paddingTop: "10px",
                    paddingLeft: "10px",
                    paddingBottom: "10px",
                  }}
                >
                  <Link
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      paddingBottom: "5px",
                      textDecoration: "none",
                      color: "black",
                    }}
                    onClick={() => {
                      history.push("/UserProfile");
                    }}
                  >
                    <Avatar />
                    <Typography
                      sx={{
                        marginLeft: "5px !important",
                        marginTop: "5px !important",
                      }}
                    >
                      Profile
                    </Typography>
                  </Link>

                  <Link
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      textDecoration: "none",
                      color: "black",
                    }}
                    onClick={() => {
                      history.push("/Upload");
                    }}
                  >
                    <CloudUploadIcon
                      sx={{ marginRight: "6px" }}
                      fontSize="large"
                    />
                    <Typography
                      sx={{
                        marginLeft: "5px !important",
                        marginTop: "5px !important",
                      }}
                    >
                      Upload Video
                    </Typography>
                  </Link>
                </div>

                <Link
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    color: "red",
                    border: "1px solid gray",
                    textDecoration: "none",
                    backgroundColor: "white",
                    borderBottomLeftRadius: "15px",
                    borderBottomRightRadius: "15px",
                    paddingLeft: "10px",
                    paddingTop: "10px",
                    paddingBottom: "10px",
                  }}
                  onClick={() => {
                    SignedOut();
                    localStorage.setItem("auth", false);
                    history.push("/");
                    localStorage.setItem("user", null);
                    localStorage.setItem("displayName", null);
                    context.toggleMenuState();
                  }}
                >
                  <Logout sx={{ marginTop: "5px" }} fontSize="small" />
                  <Typography
                    sx={{
                      marginLeft: "5px !important",
                      marginTop: "2.5px !important",
                    }}
                  >
                    Logout
                  </Typography>
                </Link>
              </div>
            </Box>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Link className="login__link" to="/login">
              <LoginIcon
                sx={{ color: "white", marginRight: "5px", marginTop: "-2px" }}
                fontSize="medium"
              />
              Login
            </Link>
          </div>
        )
      }
    </AppContext.Consumer>

                <Avatar sx={{ width: 40, height: 40 }}>
                  <img
                    className="avatar-profile-img"
                    id="avt-img"
                    src={ProfilePic}
                    alt=""
                    srcSet=""
                  />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={() => {
                history.push("/UserProfile");
              }}
            >
              <Avatar />{" "}
              <Typography sx={{ marginLeft: "5px" }}>Profile</Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                history.push("/Upload");
              }}
            >
              <CloudUploadIcon
                sx={{ marginLeft: "-5px", marginRight: "12px" }}
                fontSize="large"
              />
              Upload Video
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                SignedOut();
                localStorage.setItem("auth", false);
                history.push("/");
                localStorage.setItem("user", null);
                localStorage.setItem("displayName", null);
              }}
            >
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Link className="login__link" to="/login">
            <LoginIcon
              sx={{ color: "white", marginRight: "5px", marginTop: "-2px" }}
              fontSize="medium"
            />
            Login
          </Link>
        </div>
      )}
    </React.Fragment>

  );
}
