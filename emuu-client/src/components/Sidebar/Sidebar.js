import React, { useState, useEffect } from "react";
import "./Sidebar.scss";
import { getAuth } from "firebase/auth";
import { useHistory } from "react-router-dom";
import Subscriptions from "../UserProfile/SubscriptionsList/Subscriptions.js";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Avatar } from "@mui/material";
import axios from "axios";
import AppContext from "../../AppContext";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const history = useHistory();
  const authUsersNavigation = ["Home", "User Profile", "Upload Video"];
  const unAuthorizedNavigation = ["Home"];
  const isAuthorized = localStorage.getItem("auth");

  const currentNavigation =
    isAuthorized === "true" ? authUsersNavigation : unAuthorizedNavigation;
  const [firebaseData, setFirebaseData] = useState([]);
  async function getData() {
    const response = await axios.get(
      //sends axios get for firebase data used for search bar
      "https://emuu-cz5iycld7a-ue.a.run.app/auth/firebase-data"
    );
    const users = response.data.message.Users;
    const videos = response.data.message.Videos;
    var completeFirebaseData = videos.concat(users);
    //stores data in an array
    setFirebaseData(completeFirebaseData);
  }
  //runs getData upon page load
  useEffect(async () => {
    await getData();
  }, []);
  const [ProfilePic, setProfilePic] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;
  //sets displayName if user is Authorized
  if (user) {
    var userName = user.displayName;
    localStorage.setItem("displayName", user.displayName);
  } else {
    var userName = null;
  }
  //function to get users data
  async function getMainUser() {
    const dis = {
      displayName: userName,
    };
    await axios
      //sends username with axios post to server
      .post(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/navbar",
        JSON.stringify({ ...dis })
      )
      .then(function (response) {});
    //axios get request to receive users data
    const response = await axios.get(
      "https://emuu-cz5iycld7a-ue.a.run.app/auth/navbar"
    );
    //sets users profile pic for sidebar
    const user = response.data.message.UserDetails;
    setProfilePic(user[0].ProfilePictureUrl);
    //sets profile pic in localStorage for profile menu in nav bar
    localStorage.setItem("ProfilePictureUrl", user[0].ProfilePictureUrl);
  }
  //if displayName is registered, runs getMainUser
  if (userName !== null) {
    getMainUser();
  }

  const usersArr = firebaseData?.filter(
    (obj) => obj.hasOwnProperty("Username") && !obj.hasOwnProperty("VideoUrl")
  );
  const videosArr = firebaseData?.filter(
    (obj) => obj.hasOwnProperty("Username") && obj.hasOwnProperty("VideoUrl")
  );

  return (
    <AppContext.Consumer>
      {(context) => (
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <Drawer variant="permanent" open={context.isSidebarOpen}>
            <DrawerHeader>
              <IconButton onClick={() => context.toggleSidebarState()}>
                {theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )}
              </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
              {currentNavigation.map((text, index) => (
                <ListItem key={text} disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: context.isSidebarOpen
                        ? "initial"
                        : "center",
                      px: 2.5,
                    }}
                    onClick={() =>
                      history.push(
                        index === 0
                          ? "/"
                          : index === 1
                          ? "/UserProfile"
                          : index === 2 && "/Upload"
                      )
                    }
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: context.isSidebarOpen ? 3 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      {index === 0 ? (
                        <HomeIcon fontSize="large" />
                      ) : index === 1 ? (
                        <Avatar
                          src={ProfilePic}
                          fontSize="large"
                          alt="avatar-alt"
                        />
                      ) : (
                        index === 2 && <CloudUploadIcon fontSize="large" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={text}
                      sx={{ opacity: context.isSidebarOpen ? 1 : 0 }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
            <List>
              {context.isSidebarOpen && (
                <Typography
                  className="subscribers"
                  variant="subtitle1"
                  align="left"
                  ml={2}
                >
                  Subscriptions
                </Typography>
              )}
              <Subscriptions />
            </List>
          </Drawer>
        </Box>
      )}
    </AppContext.Consumer>
  );
}
