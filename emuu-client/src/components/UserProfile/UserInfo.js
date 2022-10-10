import React from "react";
import "./UserInfo.scss";



function UserInfo() {



  return (
    <div className="Main-UserInfo-Container">
      <h3 className="about">About</h3>

      <p className="about__info">Joined 30 Sep 2022</p>
      <hr />
      <p className="about__info">100 Subscribers</p>
      <hr />
      <p className="about__info">10 Videos posted</p>

    </div>
  );
}

export default UserInfo;
