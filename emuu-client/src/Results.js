import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "./Firebase.js";
function Results({ search, setViewUser }) {
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    //request and fill videos array
    const videosRef = query(
      collection(db, "Videos"),
      where("VideoTitle", "==", search)
    );
    const _videoIds = await getDocs(videosRef);
    const videoIds = [];
    _videoIds.docs.forEach((_doc) => videoIds.push(_doc.id));
    console.log(videoIds);
    const _videos = [];
    for (let i = 0; i < videoIds.length; i++) {
      const _doc = await getDoc(doc(db, "Videos", videoIds[i]));
      _videos.push(_doc.data());
    }
    setVideos(_videos);

    //request and fill users
    const usersRef = query(
      collection(db, "Users"),
      where("Username", "==", search)
    );
    const _userIds = await getDocs(usersRef);
    const userIds = [];
    _userIds.docs.forEach((_doc) => userIds.push(_doc.id));
    console.log(userIds);
    const _users = [];
    for (let i = 0; i < userIds.length; i++) {
      const _doc = await getDoc(doc(db, "Users", userIds[i]));
      _users.push(_doc.data());
    }
    console.log(_users);
    setUsers(_users);
  }, [search]);

  return (
    <div className="Results">
      <h1>Results</h1>
      <h2>Videos that match</h2>
      <div className="video-row">
        {videos &&
          videos.map((video) => (
            <div key={Math.random() * 100000}>
              <video height="250" controls src={video.VideoUrl}>
                {" "}
              </video>
            </div>
          ))}
      </div>
      <h2>users that match </h2>
      {users &&
        users.map((user) => (
          <Link to="/view-profile">
            <div onClick={setViewUser(user)} className="results-user">
              <img src={user.ProfilePictureUrl} />
              <h3>{user.Username}</h3>
            </div>
          </Link>
        ))}
    </div>
  );
}

export default Results;