import React, { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./Home.scss";
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

const theme = createTheme({
  palette: {
    primary: {
      light: "#484848",
      main: "#212121",
      dark: "#000000",
      contrastText: "#fff",
    },
    secondary: {
      light: "#6bffff",
      main: "#0be9d0",
      dark: "#00b69f",
      contrastText: "#000",
    },
  },
});

function Home({ setVideo }) {
  const [topVideos, setTopVideos] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);

  async function getVideos() {
    //Get all video data
    const querySnapshot = await getDocs(collection(db, "Videos"));

    //Create array for top videos and sort by likes
    const querySnapshotTop = [];
    querySnapshot.forEach((doc) => querySnapshotTop.push(doc.data()));
    sortVideosByLikes(querySnapshotTop);
    const topVideosArr = [];
    querySnapshotTop.forEach((doc) => {
      topVideosArr.push(doc);
    });
    setTopVideos(topVideosArr);

    //Create array for recent videos and sort by upload date
    const querySnapshotRecent = [];
    querySnapshot.forEach((doc) => querySnapshotRecent.push(doc.data()));
    sortVideosByTime(querySnapshotRecent);
    const recentVideosArr = [];
    querySnapshotRecent.forEach((doc) => {
      recentVideosArr.push(doc);
    });
    setRecentVideos(recentVideosArr);
  }

  //Sort function for liked videos
  function sortVideosByLikes(videos) {
    for (let i = 0; i < videos.length - 1; i++) {
      for (let j = 0; j < videos.length - 1 - i; j++) {
        if (videos[j].Likes < videos[j + 1].Likes) {
          let temp = videos[j];
          videos[j] = videos[j + 1];
          videos[j + 1] = temp;
        }
      }
    }
  }

  //Sort function for date uploaded
  function sortVideosByTime(videos) {
    for (let i = 0; i < videos.length - 1; i++) {
      for (let j = 0; j < videos.length - 1 - i; j++) {
        if (videos[j].uploadTime < videos[j + 1].uploadTime) {
          let temp = videos[j];
          videos[j] = videos[j + 1];
          videos[j + 1] = temp;
        }
      }
    }
  }

  useEffect(async () => {
    await getVideos();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="Home">
        <p class="text-start">
          <h2>
            <div class="p-4"> Top Rated Videos </div>
          </h2>
          <div className="video-row">
            {" "}
            {topVideos &&
              topVideos.map((video) => (
                <div>
                  <video controls height="250" src={video.VideoUrl}></video>
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
                    | {video.Username} | {video.Likes} Likes | {video.Views}{" "}
                    Views{" "}
                  </p>
                </div>
              ))}
          </div>
        </p>

        <p class="text-start">
          <h2>
            <div class="p-4"> Recently Uploaded </div>
          </h2>
          <div className="video-row">
            {" "}
            {recentVideos &&
              recentVideos.map((video) => (
                <div>
                  <video controls height="250" src={video.VideoUrl}></video>
                  <p>
                    <Link to="/video">
                      <span
                        onClick={() => {
                          setVideo(video);
                        }}
                      >
                        {video.VideoTitle}
                      </span>
                    </Link>{" "}
                    | {video.Username} | {video.Likes} Likes | {video.Views}{" "}
                    Views{" "}
                  </p>
                </div>
              ))}
          </div>
        </p>
      </div>
    </ThemeProvider>
  );
  useEffect = () => {
    // Get clips
  };
}

export default Home;