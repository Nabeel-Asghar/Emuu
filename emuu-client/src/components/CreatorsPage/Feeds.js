import React, { useEffect, useState } from "react";
import "./Feeds.scss";
import { Avatar } from "@mui/material";
import YouTubeJSON from "../data/youtube-videos.json";
import { AxiosContext } from "react-axios/lib/components/AxiosProvider";
import { storage } from "../../Firebase.js";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "../../Firebase.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";
import { Link } from "react-router-dom";
function Feeds({ setVideo, setUserProfile }) {
  const [recentVideos, setRecentVideos] = useState([]);
  const displayName = localStorage.getItem("CreatorName");

  async function getVideos() {
    //Get all video data
    const docRef = collection(db, "Videos");
    const queryData = await query(docRef, where("Username", "==", displayName));
    const querySnapshot = await getDocs(queryData);

    //Create array for recent videos and sort by upload date
    const querySnapshotRecent = [];
    querySnapshot.forEach((doc) => querySnapshotRecent.push(doc));
    sortVideosByTime(querySnapshotRecent);
    const recentVideosArr = [];
    querySnapshotRecent.forEach((doc) => {
      recentVideosArr.push(doc.data());
    });

    setRecentVideos(recentVideosArr);
  }

  //Sort function for date uploaded
  function sortVideosByTime(videos) {
    for (let i = 0; i < videos.length - 1; i++) {
      for (let j = 0; j < videos.length - 1 - i; j++) {
        if (videos[i].data().uploadTime < videos[i + 1].data().uploadTime) {
          let temp = videos[i];
          videos[i] = videos[i + 1];
          videos[i + 1] = temp;
        }
      }
    }
  }

  useEffect(async () => {
    await getVideos();
  }, []);

  return (
    <div className="feed-container">
      <h3 className="feed__heading">Feed</h3>
      <div className="videos__container">
        {recentVideos &&
          recentVideos.map((video) => (
            <div>
              <img
                controls
                height="250"
                width="400"
                src={video.thumbnailUrl}
              ></img>
              <p>
                <Link to="/video">
                  {" "}
                  <span
                    onClick={() => {
                      setVideo(video);
                    }}
                  >
                    {video.VideoTitle}
                  </span>
                </Link>{" "}
                | {video.Username} | {video.Likes} Likes | {video.Views} Views{" "}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Feeds;