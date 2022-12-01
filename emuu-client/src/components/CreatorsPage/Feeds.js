import React, { useEffect, useState } from "react";
import "./Feeds.scss";
import { Avatar } from "@mui/material";
import axios from "axios";
import { db } from "../../Firebase.js";
import { doc, getDoc } from "firebase/firestore";
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
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

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

function Feeds({ setVideo, setUserProfile }) {
  const [recentVideos, setRecentVideos] = useState([]);
  const [topVideos, setTopVideos] = useState([]);
  const [pages, setPages] = useState(undefined);
  const [page, setPage] = useState(1);

  const displayName = localStorage.getItem("Creator");
  const [sort, setSort] = React.useState("Recently Uploaded");

  const docRef = doc(db, "Users", displayName);

  const [ProfilePic, setProfilePic] = useState("");
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

  useEffect(async () => {
    await getVideos();
  }, [page]);

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
          </div>{" "}
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default Feeds;
