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
  getDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";

function Feeds({ setVideo, setUserProfile }) {
  const [recentVideos, setRecentVideos] = useState([]);
  const displayName = localStorage.getItem("CreatorName");
  const docRef = doc(db, "Users", displayName);

  const [ProfilePic, setProfilePic] = useState("");
  getDoc(docRef).then((docSnap) => {
    setProfilePic(docSnap.data().ProfilePictureUrl);
  });

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
    <container className="feed-container">
      <h3 className="feed__heading">Feed</h3>
      <div className="videos__container">
        {recentVideos &&
          recentVideos.map((video) => (
            <Card sx={{ maxWidth: 395, height: 400  }}>
              <CardMedia component="img" image={video.thumbnailUrl} />
              <CardContent>
                <CardHeader
                  avatar={
                    <Avatar
                      sx={{ width: 60, height: 60 }}
                      src={ProfilePic}
                    ></Avatar>
                  }
                  title={
                    <Typography
                      variant="body2"
                      color="text.primary"
                      fontWeight="bold"
                      fontSize="20px"
                    >
                      <Link to="/video">
                        <span
                          onClick={() => {
                            setVideo(video);
                          }}
                        >
                          {video.VideoTitle}
                        </span>
                      </Link>
                    </Typography>
                  }
                />

                <div className="videoInfo">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight="medium"
                    fontSize="18px"
                  >
                    {" "}
                    {video.Username} &ensp;&ensp;&ensp;&ensp;&ensp;{video.Likes}{" "}
                    Likes &#x2022; {video.Views} Views
                  </Typography>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </container>
  );
}

export default Feeds;

