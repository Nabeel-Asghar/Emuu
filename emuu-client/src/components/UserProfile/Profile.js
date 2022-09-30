import React from "react";
import "./Profile.scss";
import Feeds from "./Feeds";
import UserInfo from "./UserInfo";

function Profile() {
  return (
    <div className="MainProfileDiv">
      <div className="profile-container">
        <div className="top-portion">
          <div className="user-profile-bg-image">
            <img
              id="prf-bg-img"
              src="https://wallpaperaccess.com/full/170249.jpg"
              alt=""
              srcSet=""
            />
          </div>
          <div className="user-profile-img">
            <img
              id="prf-img"
              src="https://wallpaperaccess.com/full/170249.jpg"
              alt=""
              srcSet=""
            />
            <div className={"userName"}>Moe</div>
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
