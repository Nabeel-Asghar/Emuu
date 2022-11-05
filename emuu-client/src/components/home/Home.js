import React, { useEffect, useState, useMemo } from "react";

import "./Home.scss";
import "../UserProfile/Feeds.scss";

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
import { Link, useHistory } from "react-router-dom";
import AlgoliaSearchNavbar from "../NavbarPostLogin/AlgoliaSearchNavbar/AlgoliaSearchNavbar";
//import Video from "../common/video/Video";
import UserProfileCard from "../common/UserProfileCard/UserProfileCard";
import { db } from "../../Firebase.js";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";

import "firebase/firestore";

import firebase from "firebase/compat/app";

import Sidebar from "../Sidebar/Sidebar";

import AppContext from "../../AppContext";

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

function Home({ setVideo }, { setUserProfile }) {
  const history = useHistory();
  const [topVideos, setTopVideos] = useState([]);
  const [recentVideos, setRecentVideos] = useState([]);
  const [autocompleteState, setAutocompleteState] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [count, setCount] = useState(0);
   const [subscriberActionCount, setSubsciberActionCount] = useState(0);
     const [updatedSubscribersList, setUpdateSubscribersList] = useState([]);

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
    //Get all video data
    const querySnapshot = await getDocs(collection(db, "Videos"));

    //Create array for top videos and sort by likes
    const querySnapshotTop = [];
    querySnapshot.forEach((doc) => querySnapshotTop.push(doc));
    sortVideosByLikes(querySnapshotTop);
    const topVideosArr = [];
    querySnapshotTop.forEach((doc) => {
      topVideosArr.push(doc.data());
    });

    //Create array for recent videos and sort by upload date
    const querySnapshotRecent = [];
    querySnapshot.forEach((doc) => querySnapshotRecent.push(doc));
    sortVideosByTime(querySnapshotRecent);
    const recentVideosArr = [];
    querySnapshotRecent.forEach((doc) => {
      recentVideosArr.push(doc.data());
    });
    setTopVideos(topVideosArr);
    setRecentVideos(recentVideosArr);
  }

  //Sort function for liked videos
  function sortVideosByLikes(videos) {
    for (let i = 0; i < videos.length - 1; i++) {
      for (let j = 0; j < videos.length - 1 - i; j++) {
        if (videos[i].data().Likes < videos[i + 1].data().Likes) {
          let temp = videos[i];
          videos[i] = videos[i + 1];
          videos[i + 1] = temp;
        }
      }
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

  const usersArr = firebaseData.filter(
    (obj) => obj.hasOwnProperty("Username") && !obj.hasOwnProperty("VideoUrl")
  );
  const videosArr = firebaseData.filter(
    (obj) => obj.hasOwnProperty("Username") && obj.hasOwnProperty("VideoUrl")
  );

  async function subscribeUser(subscribersName) {
      const userRef = doc(db, "Users", userName);
      const getSubscribersListRef = await getDoc(userRef);

      let subscribersList;

      if (getSubscribersListRef.exists()) {
        subscribersList = getSubscribersListRef.data().SubscriberList;
      }

      updateDoc(userRef, {
        SubscriberList: [...subscribersList, subscribersName],
      });

      let getUpdatedSubscribersListRef = await getDoc(userRef);
      let updatedSubscribersList;

      if (getUpdatedSubscribersListRef.exists()) {
        updatedSubscribersList =
          getUpdatedSubscribersListRef.data().SubscriberList;
      }

      setSubsciberActionCount(
        (subscriberActionCount) => subscriberActionCount + 1
      );
    }

    async function unSubscribeUser(subscribersName) {
        const userRef = doc(db, "Users", userName);
        const getSubscribersListRef = await getDoc(userRef);

        let subscribersList;

        if (getSubscribersListRef.exists()) {
          subscribersList = getSubscribersListRef.data().SubscriberList;
        }

        const filteredSubscribersArr = subscribersList.filter(
          (sub) => sub !== subscribersName
        );

        updateDoc(userRef, {
          SubscriberList: filteredSubscribersArr,
        });

        let getUpdatedSubscribersListRef = await getDoc(userRef);
        let updatedSubscribersList;

        if (getUpdatedSubscribersListRef.exists()) {
          updatedSubscribersList =
            getUpdatedSubscribersListRef.data().SubscriberList;
        }

        setSubsciberActionCount(
          (subscriberActionCount) => subscriberActionCount + 1
        );
      }

  const handleCreatorProfile = (creatorsName) => {
    const creatorsData = usersArr.filter(
      (user) => user.Username === creatorsName
    );
    const creatorsDataVideos = videosArr.filter(
      (video) => video.Username === creatorsName
    );
    localStorage.setItem("creatorsData", JSON.stringify(creatorsData));
    localStorage.setItem(
      "creatorsDataVideos",
      JSON.stringify(creatorsDataVideos)
    );
    history.push("/creator");
  };

  useEffect(async () => {
      const userRefInitial = doc(db, "Users", userName);
      const getSubscribersListRefInitial = await getDoc(userRefInitial);
      let subscribersListInitial;
      if (getSubscribersListRefInitial.exists()) {
        subscribersListInitial =
          getSubscribersListRefInitial.data().SubscriberList;
      }
      setUpdateSubscribersList(subscribersListInitial);
    }, [subscriberActionCount]);

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
<>
            <AlgoliaSearchNavbar
              autocomplete={autocomplete}
              searchInput={searchInput}
            />
            <ThemeProvider theme={theme}>
              <div className="Home">
                {showSearchResults && (
                  <p class="text-start">
                    <h2 className="video__category__title p-4">
                      Search Results
                    </h2>
                    <div className="video-row">
                      {" "}
                      {searchResultsVideosArr &&
                        searchResultsVideosArr.map((video, index) => (
                          <div id={index}>
                            <img
                              controls
                              height="250"
                              width="400"
                              src={video.thumbnailUrl}
                            />
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
                            onClick={() => {
                            updatedSubscribersList?.includes(user.Username)
                            ? unSubscribeUser(user.Username)
                            : subscribeUser(user.Username);
                            }}
                            handleUserClick={() =>
                              handleCreatorProfile(user.Username)
                            }
                              buttonTitle={
                             updatedSubscribersList?.includes(user.Username)
                                                            ? "Unsubscribe"
                                                            : "Subscribe"
                                                        }
                          />
                        ))}
                    </div>
                  </p>
                )}
                <p class="text-start">
                  <h2 className="video__category__title p-4">
                    Top Rated Videos
                  </h2>
                  <div className="video-row">
                    {" "}
                    {topVideos &&
                      topVideos.map((video, index) => (
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
                </p>
                <p class="text-start">
                  <h2 className="video__category__title p-4">
                    Recently Uploaded
                  </h2>

                  <div className="video-row">
                    {" "}
                    {recentVideos &&
                      recentVideos.map((video, index) => (
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
                </p>
              </div>
            </ThemeProvider>
            </>
          </div>
        </div>
      )}
    </AppContext.Consumer>
  );
}

export default Home;
