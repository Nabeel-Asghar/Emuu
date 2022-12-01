import React, { useEffect, useState } from "react";
import "./Feeds.scss";
import { Avatar } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Subscriptions from "./SubscriptionsList/Subscriptions.js";

import { Link } from "react-router-dom";

import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

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
import { useHistory } from "react-router-dom";
import { getAuth } from "firebase/auth";
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
  const [sort, setSort] = React.useState("Recently Uploaded");
  const [pages, setPages] = useState(undefined);
  const [page, setPage] = useState(1);
  const [
    updatedSubscribersListCompleteData,
    setUpdateSubscribersListCompleteData,
  ] = useState([]);

  const history = useHistory();
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    var displayName = user.displayName;
  } else {
    var displayName = null;
  }

  //Videos for Videos feed
  async function getVideos() {
    const disAndPage = {
      displayName: displayName,
      pageNumber: page.toString(),
    };
    await axios
      .post(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/video",
        JSON.stringify({ ...disAndPage })
      )
      .then(function (response) {});
    try {
      const response = await axios.get(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/video"
      );

      setTopVideos(response.data.message.MostViewed);
      setRecentVideos(response.data.message.RecentUpload);
      setPages(response.data.message.Pages);
    } catch (error) {}
  }

  async function getLikedVideos() {
    //Get all video data
    const dis = {
      displayName: displayName,
    };
    await axios
      .post(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/likedvideo",
        JSON.stringify({ ...dis })
      )
      .then(function (response) {});
    try {
      const response = await axios.get(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/likedvideo"
      );
      setLikedVideos(response.data.message.LikedVidDetails);
    } catch (error) {}
  }

  const [firebaseData, setFirebaseData] = useState([]);
  async function getData() {
    const response = await axios.get(
      "http://localhost:8080/auth/firebase-data"
    );
    const users = response.data.message.Users;
    const videos = response.data.message.Videos;
    var completeFirebaseData = videos.concat(users);
    setFirebaseData(completeFirebaseData);
  }

  useEffect(async () => {
    await getData();
  }, []);

  async function getSubscribers() {
    const dis = {
      displayName: displayName,
    };
    await axios
      .post(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/Subscribers",
        JSON.stringify({ ...dis })
      )
      .then(function (response) {});
    try {
      const response = await axios.get(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/Subscribers"
      );

      setUpdateSubscribersListCompleteData(response.data.message.SubDetails);
    } catch (error) {}
  }

  if (displayName !== null && likedVideos.length === 0) {
    getLikedVideos();
  }
  if (displayName !== null && topVideos.length === 0) {
    getVideos();
  }
  if (displayName !== null && updatedSubscribersListCompleteData.length === 0) {
    getSubscribers();
  }
  //Sort function for date uploaded

  const handleCreatorProfile = (creatorsName) => {
    localStorage.setItem("Creator", creatorsName);
    history.push("/creator");
  };

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
            <Tab label="Subscribers" value="3" />
            <Tab label="Subscriptions" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <div className="feed-container">
            <LongMenu sort={sort} setSort={setSort} />
            <div className="videos__container">
              {recentVideos &&
                sort == "Recently Uploaded" &&
                recentVideos.map((video, index) => (
                  <Card sx={{ maxWidth: 325, maxHeight: 320 }}>
                    <Link to="/video">
                      <span
                        onClick={() => {
                          setVideo(video);
                          const TitleAndTag = {
                            title: video.Title,
                            gameTag: video.GameTag,
                          };
                          axios.post(
                            "http://localhost:8080/auth/videoPage",
                            JSON.stringify({ ...TitleAndTag })
                          );
                        }}
                      >
                        <CardMedia component="img" image={video.ThumbnailUrl} />
                        <CardContent>
                          <CardHeader
                            avatar={
                              <Avatar
                                sx={{ width: 60, height: 60 }}
                                src={video.ProfilePic}
                              ></Avatar>
                            }
                            title={
                              <Typography
                                variant="body2"
                                color="text.primary"
                                fontWeight="bold"
                                fontSize="20px"
                              >
                                {video.Title}
                              </Typography>
                            }
                          />

                          <div className="videoInfo">
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight="medium"
                              fontSize="14px"
                            >
                              {video.Username}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight="medium"
                              fontSize="14px"
                            >
                              {video.Likes} Likes &#x2022; {video.Views} Views
                            </Typography>
                          </div>
                        </CardContent>
                      </span>
                    </Link>
                  </Card>
                ))}

              {topVideos &&
                sort == "Most Viewed" &&
                topVideos.map((video, index) => (
                  <Card sx={{ maxWidth: 325, maxHeight: 320 }}>
                    <Link to="/video">
                      <span
                        onClick={() => {
                          setVideo(video);
                          const TitleAndTag = {
                            title: video.Title,
                            gameTag: video.GameTag,
                          };
                          axios.post(
                            "http://localhost:8080/auth/videoPage",
                            JSON.stringify({ ...TitleAndTag })
                          );
                        }}
                      >
                        <CardMedia component="img" image={video.ThumbnailUrl} />
                        <CardContent>
                          <CardHeader
                            avatar={
                              <Avatar
                                sx={{ width: 60, height: 60 }}
                                src={video.ProfilePic}
                              ></Avatar>
                            }
                            title={
                              <Typography
                                variant="body2"
                                color="text.primary"
                                fontWeight="bold"
                                fontSize="20px"
                              >
                                {video.Title}
                              </Typography>
                            }
                          />

                          <div className="videoInfo">
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight="medium"
                              fontSize="14px"
                            >
                              {video.Username}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight="medium"
                              fontSize="14px"
                            >
                              {video.Likes} Likes &#x2022; {video.Views} Views
                            </Typography>
                          </div>
                        </CardContent>
                      </span>
                    </Link>
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
                likedVideos.map((video, index) => (
                  <Card sx={{ maxWidth: 325, maxHeight: 320 }}>
                    <Link to="/video">
                      <span
                        onClick={() => {
                          setVideo(video);
                          const TitleAndTag = {
                            title: video.Title,
                            gameTag: video.GameTag,
                          };
                          axios.post(
                            "http://localhost:8080/auth/videoPage",
                            JSON.stringify({ ...TitleAndTag })
                          );
                        }}
                      >
                        <CardMedia component="img" image={video.ThumbnailUrl} />
                        <CardContent>
                          <CardHeader
                            avatar={
                              <Avatar
                                sx={{ width: 60, height: 60 }}
                                src={video.ProfilePic}
                              ></Avatar>
                            }
                            title={
                              <Typography
                                variant="body2"
                                color="text.primary"
                                fontWeight="bold"
                                fontSize="20px"
                              >
                                {video.Title}
                              </Typography>
                            }
                          />

                          <div className="videoInfo">
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight="medium"
                              fontSize="14px"
                            >
                              {video.Username}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight="medium"
                              fontSize="14px"
                            >
                              {video.Likes} Likes &#x2022; {video.Views} Views
                            </Typography>
                          </div>
                        </CardContent>
                      </span>
                    </Link>
                  </Card>
                ))}
            </div>
          </div>
        </TabPanel>
        <TabPanel value="3">
          <div>
            {updatedSubscribersListCompleteData.map((user, index) => (
              <ListItem key={index} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: "initial",
                    px: 2.5,
                  }}
                  onClick={() => handleCreatorProfile(user.Username)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 3,
                      justifyContent: "center",
                    }}
                  >
                    <Avatar
                      src={
                        user.ProfilePictureUrl
                          ? user.ProfilePictureUrl
                          : "https://wallpaperaccess.com/full/170249.jpg"
                      }
                      alt="avatar-alt"
                    />
                  </ListItemIcon>
                  <ListItemText primary={user.Username} sx={{ opacity: 1 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </div>
        </TabPanel>
        <TabPanel value="4">
          <div className="feed-container">
            <div className="subs__container">
              <Subscriptions />
            </div>
          </div>
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default Feeds;
