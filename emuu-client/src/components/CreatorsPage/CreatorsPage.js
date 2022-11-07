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
import NavBarNoSearch from "../NavbarPostLogin/NavBarNoSearch.js";

//Function to display creator page

function Creator({ setVideo, video}) {
  const [creatorName, setCreatorName] = useState("Loading...");

  const docRef = doc(db, "Users", creatorName);

  useEffect(async () => {


    if (video) {
      localStorage.setItem("video", JSON.stringify(video));
       window.location.reload();
          return false;
    }
    if (localStorage.getItem("video")) {
      let video = JSON.parse(localStorage.getItem("video"));
      setCreatorName(video.Username);
    }
  }, []);

  const [Banner, setBanner] = useState("");
  const [ProfilePic, setProfilePic] = useState("");
  const [subscriberCount, setSubscriberCount] = useState("");

  getDoc(docRef).then((docSnap) => {

    setBanner(docSnap.data().BannerUrl);
    setProfilePic(docSnap.data().ProfilePictureUrl);
    setSubscriberCount(docSnap.data().SubscriberCount);

  });

  return (
    <>
      <NavBarNoSearch />
      <div className="MainProfileDiv">
        <div className="profile-container">
          <div className="top-portion">
            <div className="user-profile-bg-image">
              <img id="prf-bg-img" src={Banner} alt="" srcSet="" />
            </div>
          </div>

          <div className="middle-portion">
            <div className="user-profile-img">
              <img id="prf-img" src={ProfilePic} alt="" srcSet="" />

              <div className={"userName"}> {creatorName} </div>
              <div className={"subscribers-profile"}>
                {" "}
                {subscriberCount} subscribers{" "}
              </div>
            </div>
          </div>
          <div className="bottom-portion">
            <div className="right-side"></div>

            <div className="left-side"></div>
            <Feeds setVideo={setVideo} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Creator;
