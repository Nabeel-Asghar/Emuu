import React, { useEffect, useState, useMemo } from "react";
import { Avatar } from "@mui/material";
import "./Home.scss";
import "../UserProfile/Feeds.scss";
import axios from "axios";
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

import firebase from "firebase/compat/app";

import Sidebar from "../Sidebar/Sidebar";

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
        "http://localhost:8080/auth/video",
        JSON.stringify({ ...disAndPage })
      )
      .then(function (response) {
        console.log(response);
      });
    const response = await axios.get("http://localhost:8080/auth/video");
    setTopVideos(response.data.message.MostViewed);
    setRecentVideos(response.data.message.RecentUpload);
    setPages(response.data.message.Pages);
    console.log(response.data.message.RecentUpload);
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

  const userName = localStorage.getItem("displayName");

  async function subscribeUser(subscribersName) {
    console.log(subscribersName);
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
                            | {video.Username} | {video.Likes} Likes |{" "}
                            {video.Views} Views{" "}
                          </p>
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
                  Top Rated Videos
                </Typography>
                <div className="videos__container">
                  {" "}
                  {topVideos &&
                    topVideos.map((video, index) => (
                      <div>
                        <Card sx={{ maxWidth: 395, height: 400 }}>
                          <CardMedia
                            component="img"
                            image={video.ThumbnailUrl}
                          />
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
                      </div>
                    ))}
                </div>
              </p>
              <p class="text-start">
                <Typography className={"video__category__title"}>
                  Recently Uploaded
                </Typography>

                <div className="videos__container">
                  {" "}
                  {recentVideos &&
                    recentVideos.map((video, index) => (
                      <div>
                        <Card sx={{ maxWidth: 395, height: 400 }}>
                          <CardMedia
                            component="img"
                            image={video.ThumbnailUrl}
                          />
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
                      </div>
                    ))}
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
