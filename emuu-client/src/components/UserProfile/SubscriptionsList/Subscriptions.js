import React, { useState, useEffect } from "react";
import "./Subscriptions.scss";
import "../UserInfo.scss";

import { useHistory } from "react-router-dom";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Avatar } from "@mui/material";

import { db } from "../../../Firebase.js";
import { getDoc, getDocs, doc, collection } from "firebase/firestore";

const displayName = localStorage.getItem("displayName");

function Subscriptions() {
  const [subscribersData, setSubscribersData] = useState([]);

  const [count, setCount] = useState(0);
  const history = useHistory();

  const userName = localStorage.getItem("displayName");

  const firebaseData = JSON.parse(localStorage.getItem("firebase-data"));

  useEffect(async () => {
    if (count === 0) {
      const querySnapshotUsers = await getDocs(collection(db, "Users"));
      const usersArr = [];
      querySnapshotUsers.forEach((doc) => {
        usersArr.push(doc.data());
      });
      const subscribersDataArr = usersArr.filter((user) =>
        user?.SubscriberList?.includes(userName)
      );
      setSubscribersData(subscribersDataArr);
      setCount((count) => count + 1);
    }
    if (count === 1) {
      const timer = async () => {
        const querySnapshotUsers = await getDocs(collection(db, "Users"));
        const usersArr = [];
        querySnapshotUsers.forEach((doc) => {
          usersArr.push(doc.data());
        });
        const subscribersDataArr = usersArr.filter((user) =>
          user?.SubscriberList?.includes(userName)
        );
        setSubscribersData(subscribersDataArr);
      };
      const interval = setInterval(() => {
        timer();
      }, 500);
      return () => clearTimeout(interval);
    }
  }, []);

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
