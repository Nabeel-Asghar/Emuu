import React from "react";
import "./UserProfileCard.scss";
import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
//return for user profile cards in search bar
const UserProfileCard = ({ id, profileImg, username, subscribersCount }) => {
  return (
    <div className="video__details__container">
      <Link to="/creator">
        <div
          className="avatar__container"
          onClick={() => {
            localStorage.setItem("Creator", username);
          }}
        ></div>

        <Avatar
          src={
            profileImg
              ? profileImg
              : "https://wallpaperaccess.com/full/170249.jpg"
          }
          alt="avatar-alt"
        />
      </Link>
      <div className="video__description__container" id={id}>
        <Link
          to="/creator"
          className="video__title"
          onClick={() => {
            localStorage.setItem("Creator", username);
          }}
        >
          {username}
        </Link>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Link
            to="/creator"
            className="video__details"
            style={{ marginTop: "-2.5px" }}
            onClick={() => {
              localStorage.setItem("Creator", username);
            }}
          >
            {subscribersCount}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
