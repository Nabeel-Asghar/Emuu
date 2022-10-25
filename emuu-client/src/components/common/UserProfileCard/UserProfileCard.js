import React from "react";
import "./UserProfileCard.scss";
import { Avatar } from "@mui/material";

import SubscribeButton from "../Button/Button";
import { Link } from "react-router-dom";

const UserProfileCard = ({
  id,
  profileImg,
  username,
  subscribersCount,
  onClick,
}) => {
  const isAuthenticated = localStorage.getItem("auth");

  console.log(isAuthenticated, "auth status");
  return (
    <div className="video__details__container">
      <Link to="/Creator" className="avatar__container">
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
        <Link to="/Creator" className="video__title">
          {username}
        </Link>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Link
            to="/Creator"
            className="video__details"
            style={{ marginTop: "-2.5px" }}
          >
            {subscribersCount}
          </Link>
          {isAuthenticated === "true" && (
            <SubscribeButton
              buttonStyling={{ marginTop: "-20px", marginLeft: "15px" }}
              color="error"
              onClick={onClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;
