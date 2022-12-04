import React, { useEffect, useState, useMemo } from "react";
import { Avatar } from "@mui/material";
import "./Home.scss";
import "../UserProfile/Feeds.scss";
import axios from "axios";
import { createAutocomplete } from "@algolia/autocomplete-core";
import { Link } from "react-router-dom";
import AlgoliaSearchNavbar from "../NavbarPostLogin/AlgoliaSearchNavbar/AlgoliaSearchNavbar";

import UserProfileCard from "../common/UserProfileCard/UserProfileCard";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import "firebase/firestore";
import Sidebar from "../Sidebar/Sidebar";
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
  //function to get firebase data for search bar
  const [firebaseData, setFirebaseData] = useState([]);
  async function getData() {
    //axios get request receives all firebase data
    const response = await axios.get(
      "https://emuu-cz5iycld7a-ue.a.run.app/auth/firebase-data"
    );
    const users = response.data.message.Users;
    const videos = response.data.message.Videos;
    var completeFirebaseData = videos.concat(users);
    //array of users and videos data stored in use state array
    setFirebaseData(completeFirebaseData);
  }
  //upon page load run function
  useEffect(async () => {
    await getData();
  }, []);

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
                    item.Title?.toLowerCase().includes(query.toLowerCase()) ||
                    item.Username?.toLowerCase().includes(
                      query.toLocaleLowerCase()
                    )
                );
              },
              templates: {
                item({ item }) {
                  return item.Title || item.Username;
                },
              },
            },
          ];
        },
      }),
    [count]
  );
  //function to get videos for home page
  async function getVideos() {
    //sends empty string to video api in server to pull all videos
    const display = "";
    const disAndPage = {
      displayName: display,
      pageNumber: page.toString(),
    };
    await axios
      //axios post sends request with empty string to server
      .post(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/video",
        JSON.stringify({ ...disAndPage })
      )
      .then(function (response) {});
    //axios get request receives all video data
    const response = await axios.get(
      "https://emuu-cz5iycld7a-ue.a.run.app/auth/video"
    );
    //sets top/recent videos, and amount of pages for pagination
    setTopVideos(response.data.message.MostViewed);
    setRecentVideos(response.data.message.RecentUpload);
    setPages(response.data.message.Pages);
  }
  //runs function to get videos upon page load
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
                                    <Link to={`/video/${video.ID}`}>
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
                    {(topVideos.length < 1
                      ? Array.from(new Array(8))
                      : topVideos
                    ).map((video, index) => (
                      <Box key={index} sx={{ maxWidth: 325, maxHeight: 320 }}>
                        {video ? (
                          <div>
                            <Card sx={{ maxWidth: 325, maxHeight: 320 }}>
                              <Link to={`/video/${video.ID}`}>
                                <span
                                  onClick={() => {
                                    setVideo(video);
                                    const TitleAndTag = {
                                      title: video.Title,
                                      gameTag: video.GameTag,
                                    };
                                    axios.post(
                                      "https://emuu-cz5iycld7a-ue.a.run.app/auth/videoPage",
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
                                        {video.Likes} Likes &#x2022;{" "}
                                        {video.Views} Views
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
                            width={325}
                            height={310}
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
                    {(recentVideos.length < 1
                      ? Array.from(new Array(8))
                      : recentVideos
                    ).map((video, index) => (
                      <Box key={index} sx={{ maxWidth: 325, maxHeight: 320 }}>
                        {video ? (
                          <div>
                            <Card sx={{ maxWidth: 325, maxHeight: 320 }}>
                              <Link to={`/video/${video.ID}`}>
                                <span
                                  onClick={() => {
                                    setVideo(video);
                                    const TitleAndTag = {
                                      title: video.Title,
                                      gameTag: video.GameTag,
                                    };
                                    axios.post(
                                      "https://emuu-cz5iycld7a-ue.a.run.app/auth/videoPage",
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
                                        {video.Likes} Likes &#x2022;{" "}
                                        {video.Views} Views
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
                            width={325}
                            height={310}
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
