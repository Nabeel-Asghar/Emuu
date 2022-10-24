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
} from "firebase/firestore";
import HeaderPostLogin from "../NavbarPostLogin/HeaderPostLogin.js"

function Profile() {
  const [percent, setPercent] = useState(0);
  const displayName = localStorage.getItem("displayName");
  const docRef = doc(db, "Users", displayName);

  function verifyJpeg(filename) {
    const fnArr = filename.split(".");
    if (fnArr[fnArr.length - 1] == "jpeg" || fnArr[fnArr.length - 1] == "jpg")
      return true;
    return false;
  }

  function uploadBackground(e) {
    let file = e.target.files[0];

    if (!verifyJpeg(file.name)) return;
    const storage = getStorage();
    const storageRef = ref(storage, "/images/" + file.name);

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(storageRef).then((URL) =>
        setDoc(
          docRef,
          {
            BannerUrl: URL,
          },
          {
            merge: true,
          }
        )
      );
    });
  }

  function uploadProfile(e) {
    let file = e.target.files[0];
    if (!verifyJpeg(file.name)) return;
    const storage = getStorage();
    const storageRef = ref(storage, "/images/" + file.name);

    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(storageRef).then((URL) =>
        setDoc(
          docRef,
          {
            ProfilePictureUrl: URL,
          },
          {
            merge: true,
          }
        )
      );
    });
  }

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
            <input
              style={{ display: "none" }}
              id="background-inp"
              type="file"
              onChange={(e) => uploadBackground(e)}
              accept="image/jpeg"
            />
            <button
              id="background-change"
              onClick={() => document.querySelector("#background-inp").click()}
            >
              {" "}
              <AddIcon />
            </button>
          </div>

          <div className="user-profile-img">
            <img id="prf-img" src={ProfilePic} alt="" srcSet="" />
            <input
              style={{ display: "none" }}
              id="profile-inp"
              type="file"
              onChange={(e) => uploadProfile(e)}
              accept="image/jpeg"
            />
            <button
              id="profile-change"
              onClick={() => document.querySelector("#profile-inp").click()}
            >
              {" "}
              <AddIcon />
            </button>
            <div className={"userName"}> {displayName} </div>
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

export default Profile;
