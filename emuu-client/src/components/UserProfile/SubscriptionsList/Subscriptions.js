import React, { useState, useEffect } from "react";
import "./Subscriptions.scss";
import "../UserInfo.scss";

import { useHistory } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Avatar } from "@mui/material";
import axios from "axios";
import { getAuth } from "firebase/auth";

function Subscriptions() {
  const [subscribersData, setSubscribersData] = useState([]);

  const history = useHistory();
//function for firebaseData for search bar
  const [firebaseData, setFirebaseData] = useState([]);
  async function getData() {
    //sends axios get request for data
    const response = await axios.get(
      "https://emuu-cz5iycld7a-ue.a.run.app/auth/firebase-data"
    );
    const users = response.data.message.Users;
    const videos = response.data.message.Videos;
    var completeFirebaseData = videos.concat(users);
        //sets data of users and videos into an array
    setFirebaseData(completeFirebaseData);
  }
//upon page load runs getData function
  useEffect(async () => {
    await getData();
  }, []);
  const auth = getAuth();
  const user = auth.currentUser;
//function to set user display name
  if (user) {
    var displayName = user.displayName;
  } else {
    var displayName = null;
  }

  //function to get subscriptions list for user
  async function getSubscriptions() {
    const dis = {
      displayName: displayName,
    };
    //sends axios post of users name to server
    await axios
      .post(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/Subscription",
        JSON.stringify({ ...dis })
      )
      .then(function (response) {});
    try {
    //sends axios get request to receive subscriptions list of users
      const response = await axios.get(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/Subscription"
      );
        //sets subscriptions list into an array
      setSubscribersData(response.data.message.SubscriptionDetails);

    } catch (error) {}
  }

  //if statement to only allow subscriptions list to run once
  if (displayName !== null && subscribersData.length === 0) {
    getSubscriptions();
  }

  const handleSubscribersProfile = (subscribersName) => {
    localStorage.setItem("Creator", subscribersName);
    history.push("/creator");
  };
  localStorage.setItem("subscribersCount", subscribersData?.length);

  return (
    <div>
      {subscribersData?.map((user, index) => (
        <ListItem key={index} disablePadding sx={{ display: "block" }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: "initial",
              px: 1.5,
            }}
            onClick={() => handleSubscribersProfile(user.Username)}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 3,
                justifyContent: "center",
              }}
            >
              <Avatar
                src={
                  user.ProfilePictureUrl
                    ? user.ProfilePictureUrl
                    : "https://wallpaperaccess.com/full/170249.jpg"
                }
                alt="avatar-alt"
              />
            </ListItemIcon>
            <ListItemText primary={user.Username} sx={{ opacity: 1 }} />
          </ListItemButton>
        </ListItem>
      ))}
    </div>
  );
}

export default Subscriptions;
