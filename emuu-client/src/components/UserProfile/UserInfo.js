import React, { useState } from "react";
import "./UserInfo.scss";
import { db } from "../../Firebase.js";
import { getDoc, doc } from "firebase/firestore";
const displayName = localStorage.getItem("displayName");

function UserInfo() {
  const [dateJoined, setDateJoined] = useState("");
  const [Subscribers, setSubscribers] = useState("");
  const [VidNum, setVidNum] = useState("");

  getDoc(doc(db, "Users", displayName)).then((docSnap) => {
    setDateJoined(docSnap.data().DateJoined);
    setSubscribers(docSnap.data().SubscriberCount);
    setVidNum(docSnap.data().VideosPosted);
  });

  return (
    <div className="Main-UserInfo-Container">
      <h3 className="about">About</h3>

      <p className="about__info">Joined {dateJoined}</p>
      <hr />
      <p className="about__info">{Subscribers} Subscribers</p>
      <hr />
      <p className="about__info">{VidNum} Videos posted</p>
    </div>
  );
}

export default UserInfo;
