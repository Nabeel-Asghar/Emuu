import React, { useEffect, useState, useMemo } from "react";
import { Avatar } from "@mui/material";
import "./Home.scss";
import "../UserProfile/Feeds.scss";
import axios from "axios";
import Container from "@mui/material/Container";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  setDoc,
  doc,
  getDoc,
  query,
} from "firebase/firestore";
import { createAutocomplete } from "@algolia/autocomplete-core";
import { Link } from "react-router-dom";
import AlgoliaSearchNavbar from "../NavbarPostLogin/AlgoliaSearchNavbar/AlgoliaSearchNavbar";

import UserProfileCard from "../common/UserProfileCard/UserProfileCard";
import { db } from "../../Firebase.js";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
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
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { BrowserRouter, Route, useHistory } from "react-router-dom";
import firebase from "firebase/compat/app";
import Sidebar from "../Sidebar/Sidebar";
import PropTypes from "prop-types";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import AppContext from "../../AppContext";

function Home({ setVideo }, { setUserProfile }) {
  const [topVideos, setTopVideos] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [autocompleteState, setAutocompleteState] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [count, setCount] = useState(0);
  const [pages, setPages] = useState(undefined);
  const [page, setPage] = useState(1);
  const firebaseData = JSON.parse(localStorage.getItem("firebase-data"));

  const autocomplete = useMemo(
    () =>
      createAutocomplete({
        onStateChange({ state }) {
          setAutocompleteState(state);
          setSearchInput(state.query);
          if (count === 0) {
            setCount((count) => count + 1);
          }
        },
        getSources() {
          return [
            {
              sourceId: "pages-source",
              getItemInputValue({ item }) {
                // search item
                return item.query;
              },
              getItems({ query }) {
                // takes your search input and checks if anything that matches it exists in your dataset
                if (!query) {
                  return firebaseData;
                }
                return firebaseData.filter(
                  (item) =>
                    item.VideoTitle?.toLowerCase().includes(
                      query.toLowerCase()
                    ) ||
                    item.Username?.toLowerCase().includes(
                      query.toLocaleLowerCase()
                    )
                );
              },
              templates: {
                item({ item }) {
                  return item.VideoTitle || item.Username;
                },
              },
            },
          ];
        },
      }),
    [count]
  );

  async function getVideos() {
    const display = "";
    const disAndPage = {
      displayName: display,
      pageNumber: page.toString(),
    };
    await axios
      .post(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/video",
        JSON.stringify({ ...disAndPage })
      )
      .then(function (response) {});
    const response = await axios.get(
      "https://emuu-cz5iycld7a-ue.a.run.app/auth/video"
    );
    setTopVideos(response.data.message.MostViewed);
    setRecentVideos(response.data.message.RecentUpload);
    setPages(response.data.message.Pages);
  }

  useEffect(async () => {
    await getVideos();
  }, [page]);

  const dataSet = autocompleteState?.collections?.[0]?.items;
  const searchResultsVideosArr = dataSet?.filter(
    (obj) => obj.hasOwnProperty("VideoUrl") && obj.hasOwnProperty("Username")
  );
  const searchResultsUsersArr = dataSet?.filter(
    (obj) => !obj.hasOwnProperty("VideoUrl") && obj.hasOwnProperty("Username")
  );
  const showSearchResults =
    searchResultsVideosArr?.length > 0 || searchResultsUsersArr?.length > 0;

  async function subscribeUser(subscribersName) {}

  function Media(props) {
    return (
      <Grid container wrap="wrap" className="videos__container">
        {(recentVideos.length < 7
          ? Array.from(new Array(8))
          : recentVideos
        ).map((video, index) => (
          <Box key={index} sx={{ maxWidth: 380, maxHeight: 365 }}>
            {video ? (
              <div>
                <Card sx={{ maxWidth: 380, maxHeight: 365 }}>
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
              </div>
            ) : (
              <Skeleton variant="rectangular" width={380} height={365} />
            )}
          </Box>
        ))}
      </Grid>
    );
  }

  return (
    <AppContext.Consumer>
      {(context) => (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Sidebar />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: context.isSidebarOpen === true ? "87.3%" : "96.6%",
            }}
          >
            <AlgoliaSearchNavbar
              autocomplete={autocomplete}
              searchInput={searchInput}
            />

            <div className="Home">
              {showSearchResults && (
                <p class="text-start">
                  <h2 className="video__category__title p-4">Search Results</h2>
                  <div className="video-row">
                    {" "}
                    {searchResultsVideosArr &&
                      searchResultsVideosArr.map((video, index) => (
                        <div>
                          <Card sx={{ width: 385, height: 375 }}>
                            <CardMedia
                              component="img"
                              image={video.ThumbnailUrl}
                            />
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
                                  {video.Likes} Likes &#x2022; {video.Views}{" "}
                                  Views
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
                        </div>
                      ))}
                  </div>

                  <div className="video-row">
                    {" "}
                    {searchResultsUsersArr &&
                      searchResultsUsersArr.map((user, index) => (
                        <UserProfileCard
                          id={index}
                          profileImg={user.ProfilePictureUrl}
                          username={user.Username}
                          subscribersCount={`${user.SubscriberCount} Subscribers`}
                          onClick={() => subscribeUser(user.Username)}
                        />
                      ))}
                  </div>
                </p>
              )}
              <p class="text-start">
                <Typography className={"video__category__title"}>
                  Most Viewed Videos
                </Typography>
                <div className="videos__container">
                  {" "}
                  <Grid container wrap="wrap" className="videos__container">
                    {(topVideos.length < 7
                      ? Array.from(new Array(8))
                      : topVideos
                    ).map((video, index) => (
                      <Box key={index} sx={{ maxWidth: 380, maxHeight: 365 }}>
                        {video ? (
                          <div>
                            <Card sx={{ maxWidth: 380, maxHeight: 365 }}>
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
                                  <CardMedia
                                    component="img"
                                    image={video.ThumbnailUrl}
                                  />

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
                                        fontSize="18px"
                                      >
                                        {video.Likes} Likes &#x2022;{" "}
                                        {video.Views} Views
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
                                </span>
                              </Link>
                            </Card>
                          </div>
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={380}
                            height={365}
                          />
                        )}
                      </Box>
                    ))}
                  </Grid>
                </div>
              </p>
              <p class="text-start">
                <Typography className={"video__category__title"}>
                  Recently Uploaded
                </Typography>

                <div className="videos__container">
                  {" "}
                  <Grid container wrap="wrap" className="videos__container">
                    {(recentVideos.length < 8
                      ? Array.from(new Array(8))
                      : recentVideos
                    ).map((video, index) => (
                      <Box key={index} sx={{ maxWidth: 380, maxHeight: 365 }}>
                        {video ? (
                          <div>
                            <Card sx={{ maxWidth: 380, maxHeight: 365 }}>
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
                                  <CardMedia
                                    component="img"
                                    image={video.ThumbnailUrl}
                                  />
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
                                        fontSize="18px"
                                      >
                                        {video.Likes} Likes &#x2022;{" "}
                                        {video.Views} Views
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
                                </span>
                              </Link>
                            </Card>
                          </div>
                        ) : (
                          <Skeleton
                            variant="rectangular"
                            width={380}
                            height={365}
                          />
                        )}
                      </Box>
                    ))}
                  </Grid>
                </div>
              </p>
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
          </div>
        </div>
      )}
    </AppContext.Consumer>
  );
}

export default Home;
