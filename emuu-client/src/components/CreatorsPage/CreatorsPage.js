import "./UserInfo.scss";
import "./Feeds.scss";
import { Avatar } from "@mui/material";
import { AxiosContext } from "react-axios/lib/components/AxiosProvider";
import React, { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import "./Profile.scss";
import "../../Firebase.js";
import Feeds from "./Feeds";
import UserInfo from "./UserInfo";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../Firebase.js";
import {
  getDoc,
  getDocs,
  setDoc,
  doc,
  collection,
  query,
  where,
  onSnapshot,
  increment,
  updateDoc,
} from "firebase/firestore";
import HeaderPostLogin from "../NavbarPostLogin/HeaderPostLogin.js"

//Function to display creator page
function Creator({ video, setUserProfile }) {
  const [creatorName, setCreatorName] = useState("Temp");
  const docRef = doc(db, "Users", creatorName);

  useEffect(async () => {
    if (video) {
      localStorage.setItem("video", JSON.stringify(video));
    }
    if (localStorage.getItem("video")) {
      let video = JSON.parse(localStorage.getItem("video"));
      setCreatorName(video.Username);
    }
    if (!video && !localStorage.getItem("video")) {
      //if there's no video on this page, redirect to home
      window.location.pathname = "/";
    }
  }, []);

  const [Banner, setBanner] = useState("");
  const [ProfilePic, setProfilePic] = useState("");

  getDoc(docRef).then((docSnap) => {
    setBanner(docSnap.data().BannerUrl);
    setProfilePic(docSnap.data().ProfilePictureUrl);
  });

  return (
  <>
  <HeaderPostLogin/>
    <div className="MainProfileDiv">
      <div className="profile-container">
        <div className="top-portion">
          <div className="user-profile-bg-image">
            <img id="prf-bg-img" src={Banner} alt="" srcSet="" />
          </div>

          <div className="user-profile-img">
            <img id="prf-img" src={ProfilePic} alt="" srcSet="" />

            <div className={"userName"}> {creatorName} </div>
          </div>
        </div>
        <div className="bottom-portion">
          <div className="right-side"></div>
          <UserInfo />

          <div className="left-side"></div>
          <Feeds />
        </div>
      </div>
    </div>
    </>
  );
}

export default Creator;
