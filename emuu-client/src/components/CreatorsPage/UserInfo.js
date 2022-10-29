import React from "react";
import "./UserInfo.scss";

const UserInfo = ({ dateJoined, subscribers, videosPostedCount }) => {
  return (
    <div className="Main-UserInfo-Container">
      <h3 className="about">About</h3>
      <p className="about__info">Joined {dateJoined}</p>
      <hr />
      <p className="about__info">{subscribers} Subscribers</p>
      <hr />
      <p className="about__info">{videosPostedCount} Videos posted</p>
    </div>
  );
};

export default UserInfo;
