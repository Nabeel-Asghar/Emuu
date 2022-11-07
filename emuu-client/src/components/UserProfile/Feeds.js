import React, { useEffect, useState } from "react";
import "./Feeds.scss";

import { Link, useHistory } from "react-router-dom";
import { Avatar } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

import Tabs from "../tabs/Tabs";

import { db } from "../../Firebase.js";

const Feeds = ({ setVideo }, { setUserProfile }) => {
  const [updatedSubscribersList, setUpdateSubscribersList] = useState([]);
  const [
    updatedSubscribersListCompleteData,
    setUpdateSubscribersListCompleteData,
  ] = useState([]);
  const [users, setUsers] = useState([]);
  const history = useHistory();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [recentVideos, setRecentVideos] = useState([]);
  const displayName = localStorage.getItem("displayName");

  async function getVideos() {
    //Get all video data
    const docRef = collection(db, "Videos");
    const queryData = await query(docRef, where("Username", "==", displayName));
    const querySnapshot = await getDocs(queryData);
    //Create array for recent videos and sort by upload date
    const querySnapshotRecent = [];
    querySnapshot.forEach((doc) => querySnapshotRecent.push(doc));
    sortVideosByTime(querySnapshotRecent);
    const recentVideosArr = [];
    querySnapshotRecent.forEach((doc) => {
      recentVideosArr.push(doc.data());
    });

    setRecentVideos(recentVideosArr);
  }

  //Sort function for date uploaded
  function sortVideosByTime(videos) {
    for (let i = 0; i < videos.length - 1; i++) {
      for (let j = 0; j < videos.length - 1 - i; j++) {
        if (videos[i].data().uploadTime < videos[i + 1].data().uploadTime) {
          let temp = videos[i];
          videos[i] = videos[i + 1];
          videos[i + 1] = temp;
        }
      }
    }
  }

  const userName = localStorage.getItem("displayName");

  const firebaseData = JSON.parse(localStorage.getItem("firebase-data"));

  let subscribersListCompleteData;

  useEffect(async () => {
    const timer = async () => {
      const userRefInitial = doc(db, "Users", userName);
      const getSubscribersListRefInitial = await getDoc(userRefInitial);
      let subscribersListInitial;
      if (getSubscribersListRefInitial.exists()) {
        subscribersListInitial =
          getSubscribersListRefInitial.data().SubscriberList;
      }
      setUpdateSubscribersList(subscribersListInitial);
      const querySnapshotUsers = await getDocs(collection(db, "Users"));
      const usersArr = [];
      querySnapshotUsers.forEach((doc) => {
        usersArr.push(doc.data());
      });
      setUsers(usersArr);
      subscribersListCompleteData = usersArr.filter(
        (record) =>
          !record.hasOwnProperty("VideoUrl") &&
          record.hasOwnProperty("Username") &&
          subscribersListInitial.includes(record.Username)
      );
      setUpdateSubscribersListCompleteData(subscribersListCompleteData);
    };
    const interval = setInterval(() => {
      timer();
    }, 5000);
    return () => clearTimeout(interval);
  }, []);

  const usersArr = firebaseData.filter(
    (obj) => obj.hasOwnProperty("Username") && !obj.hasOwnProperty("VideoUrl")
  );
  const videosArr = firebaseData.filter(
    (obj) => obj.hasOwnProperty("Username") && obj.hasOwnProperty("VideoUrl")
  );

  const handleCreatorProfile = (creatorsName) => {
    const creatorsData = usersArr.filter(
      (user) => user.Username === creatorsName
    );
    const creatorsDataVideos = videosArr.filter(
      (video) => video.Username === creatorsName
    );
    localStorage.setItem("creatorsData", JSON.stringify(creatorsData));
    localStorage.setItem(
      "creatorsDataVideos",
      JSON.stringify(creatorsDataVideos)
    );
    history.push("/creator");
  };

  useEffect(async () => {
    await getVideos();
  }, []);

  return (
    <div className="feed-container">
      <Tabs value={value} handleChange={handleChange} />
      {value === 0 ? (
        <div className="videos__container">
          {recentVideos &&
            recentVideos.map((video) => (
              <div>
                <img
                  controls
                  height="250"
                  width="400"
                  src={video.thumbnailUrl}
                ></img>
                <p>
                  <Link to="/video">
                    {" "}
                    <span
                      onClick={() => {
                        setVideo(video);
                      }}
                    >
                      {video.VideoTitle}
                    </span>
                  </Link>{" "}
                  | {video.Username} | {video.Likes} Likes | {video.Views} Views{" "}
                </p>
              </div>
            ))}
        </div>
      ) : value === 1 ? (
        <div> Liked Videos Here </div>
      ) : (
        value === 2 &&
        updatedSubscribersListCompleteData.map((user, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: "initial",
                px: 2.5,
              }}
              onClick={() => handleCreatorProfile(user.Username)}
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
        ))
      )}
    </div>
  );
};

export default Feeds;
