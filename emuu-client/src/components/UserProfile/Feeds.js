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
  getDoc,
  doc,
  query,
  where,
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
import axios from "axios";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const options = ["Recently Uploaded", "Most Viewed"];

const ITEM_HEIGHT = 48;

function LongMenu({ sort, setSort }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (e) => {
    setSort(e.target.innerText);
    setAnchorEl(null);
  };

  return (
    <div>
      Sort By
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: "20ch",
          },
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            selected={option === sort}
            onClick={handleClose}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

function Feeds({ setVideo }) {
  const [recentVideos, setRecentVideos] = useState([]);
  const [topVideos, setTopVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const displayName = localStorage.getItem("displayName");
  const docRef = doc(db, "Users", displayName);
  const [ProfilePic, setProfilePic] = useState("");
  const [sort, setSort] = React.useState("Recently Uploaded");
  const [pages, setPages] = useState(undefined);
  const [page, setPage] = useState(1);

  getDoc(docRef).then((docSnap) => {
    setProfilePic(docSnap.data().ProfilePictureUrl);
  });

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //Videos for Videos feed
  async function getVideos() {
    const disAndPage = {
      displayName: displayName,
      pageNumber: page.toString(),
    };
    await axios
      .post(
        "http://localhost:8080/auth/video",
        JSON.stringify({ ...disAndPage })
      )
      .then(function (response) {
        console.log(response);
      });
    try {
      const response = await axios.get("http://localhost:8080/auth/video");

      setTopVideos(response.data.message.MostViewed);
      setRecentVideos(response.data.message.RecentUpload);
      setPages(response.data.message.Pages);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(async () => {
    await getVideos();
  }, [page]);

  async function getLikedVideos() {
    //Get all video data
    const docRef = collection(db, "Videos");
    const queryData = await query(
      docRef,
      where("usersThatLiked", "array-contains", displayName)
    );
    const querySnapshot = await getDocs(queryData);
    //Create array for recent videos and sort by upload date
    const querySnapshotLikedVideos = [];
    querySnapshot.forEach((doc) => querySnapshotLikedVideos.push(doc));
    sortVideosByTime(querySnapshotLikedVideos);
    const likedVideosArr = [];
    querySnapshotLikedVideos.forEach((doc) => {
      likedVideosArr.push(doc.data());
    });

    setLikedVideos(likedVideosArr);
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
    await getLikedVideos();
  }, []);

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Videos" value="1" />
            <Tab label="Liked Videos" value="2" />
            <Tab label="Subscriptions" value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <div className="feed-container">
            <LongMenu sort={sort} setSort={setSort} />
            <div className="videos__container" onScroll={(e) => console.log(e)}>
              {recentVideos &&
                sort == "Recently Uploaded" &&
                recentVideos.map((video) => (

                  <Card sx={{ maxWidth: 380, height: 375 }}>
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
                          {video.Likes} Likes &#x2022; {video.Views} Views
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight="medium"
                          fontSize="18px"
                        >
                          {video.Username}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {topVideos &&
                sort == "Most Viewed" &&
                topVideos.map((video) => (
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
            {pages && (
              <Stack spacing={2}>
                <Pagination
                  count={pages}
                  size="large"
                  onChange={(e, p) => {
                    setPage(p);
                  }}
                />
              </Stack>
            )}
          </div>
        </TabPanel>
        <TabPanel value="2">
          <div className="feed-container">
            <div className="videos__container">
              {likedVideos &&
                likedVideos.map((video) => (
                  <Card sx={{ maxWidth: 380, height: 400 }}>
                    <CardMedia component="img" image={video.thumbnailUrl} />
                    <CardContent>
                      <CardHeader
                        avatar={
                          <Avatar sx={{ width: 60, height: 60 }}></Avatar>
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
                          {video.Likes} Likes &#x2022; {video.Views} Views
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          fontWeight="medium"
                          fontSize="18px"
                        >
                          {video.Username}
                        </Typography>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default Feeds;
