import React, {useState} from "react";
import "./Profile.scss";
import Feeds from "./Feeds";
import UserInfo from "./UserInfo";

const displayName = localStorage.getItem("displayName");

function Profile() {

  return (
    <div className="MainProfileDiv">
      <div className="profile-container">
        <div className="top-portion">
          <div className="user-profile-bg-image">
            <img
              id="prf-bg-img"
              src="http://mcentre.lk/frontend/assets/images/default-banner.png"
              alt=""
              srcSet=""
            />
          </div>
          <div className="user-profile-img">
            <img
              id="prf-img"
              src="https://i.stack.imgur.com/l60Hf.png"
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
