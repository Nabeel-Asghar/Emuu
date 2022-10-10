import React, {useState, useEffect} from "react";
import "./Profile.scss";
import Feeds from "./Feeds";
import UserInfo from "./UserInfo";
import {db} from "../../Firebase.js"
import {  getDoc ,doc, collection, query, where, onSnapshot } from "firebase/firestore";

const displayName = localStorage.getItem("displayName");





function Profile() {

const[Banner, setBanner] = useState("");
const[ProfilePic, setProfilePic] = useState("");


getDoc(doc(db, "Users", displayName)).then(docSnap => {

  setBanner(docSnap.data().BannerUrl) ;
  setProfilePic(docSnap.data().ProfilePictureUrl);

})




  return (
    <div className="MainProfileDiv">
      <div className="profile-container">
        <div className="top-portion">
          <div className="user-profile-bg-image">
            <img
              id="prf-bg-img"
              src={Banner}
              alt=""
              srcSet=""
            />
          </div>
          <div className="user-profile-img">
            <img
              id="prf-img"
              src={ProfilePic}
              alt=""
              srcSet=""
            />
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
  );
}

export default Profile;
