import React, { useEffect, useState } from "react";
import "./Feeds.scss";
import { Avatar } from "@mui/material";
import YouTubeJSON from "../data/youtube-videos.json";
import { AxiosContext } from "react-axios/lib/components/AxiosProvider";
import { storage } from "../../Firebase.js";
import axios from "axios";

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
import Box from "@mui/material/Box";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";

function Feeds({ setVideo, setUserProfile }) {
  const [recentVideos, setRecentVideos] = useState([]);
  const displayName = localStorage.getItem("CreatorName");
  const docRef = doc(db, "Users", displayName);

  const [ProfilePic, setProfilePic] = useState("");
  getDoc(docRef).then((docSnap) => {
    setProfilePic(docSnap.data().ProfilePictureUrl);
  });

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function getVideos() {
    await axios
      .post("http://localhost:8080/auth/video", JSON.stringify({ displayName }))
      .then(function (response) {
        console.log(response);
      });
    try {
      const response = await axios.get("http://localhost:8080/auth/video");
      console.log(response.data.message);
      //setTopVideos(response.data.message.MostViewed)
      setRecentVideos(response.data.message.RecentUpload);
      //console.log(topVideos)
    } catch (error) {
      console.log(error);
    }
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
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Videos" value="1" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <div className="feed-container">
            <div className="videos__container">
              {recentVideos &&
                recentVideos.map((video) => (
                  <Card sx={{ maxWidth: 380, height: 400 }}>
                    <CardMedia component="img" image={video.ThumbnailUrl} />
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
                                {video.Title}
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
                          {video.Username} &ensp;&ensp;&ensp;&ensp;&ensp;
                          {video.Likes} Likes &#x2022; {video.Views} Views
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>{" "}
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default Feeds;
