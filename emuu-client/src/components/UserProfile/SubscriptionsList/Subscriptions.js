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
import { db } from "../../../Firebase.js";
import { getDoc, getDocs, doc, collection } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Subscriptions() {
  const [subscribersData, setSubscribersData] = useState([]);

  const [count, setCount] = useState(0);
  const history = useHistory();

  const firebaseData = JSON.parse(localStorage.getItem("firebase-data"));
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    var displayName = user.displayName;
  } else {
    var displayName = null;
  }
  async function getSubscriptions() {
    const dis = {
      displayName: displayName,
    };
    await axios
      .post(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/Subscription",
        JSON.stringify({ ...dis })
      )
      .then(function (response) {});
    try {
      const response = await axios.get(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/Subscription"
      );

      setSubscribersData(response.data.message.SubscriptionDetails);
      console.log(subscribersData);
    } catch (error) {}
  }

  if (displayName !== null && subscribersData.length === 0) {
    getSubscriptions();
  }

  const usersArr = firebaseData.filter(
    (obj) => obj.hasOwnProperty("Username") && !obj.hasOwnProperty("VideoUrl")
  );

  const videosArr = firebaseData.filter(
    (obj) => obj.hasOwnProperty("Username") && obj.hasOwnProperty("VideoUrl")
  );

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
