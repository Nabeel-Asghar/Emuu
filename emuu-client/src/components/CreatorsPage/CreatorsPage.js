import "./UserInfo.scss";
import "./Feeds.scss";
import "../home/Home.scss";
import React, { useState, useEffect, useMemo } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { createAutocomplete } from "@algolia/autocomplete-core";
import "./Profile.scss";
import "../../Firebase.js";
import Feed from "./Feeds";
import UserInfo from "./UserInfo";
import AlgoliaSearchNavbar from "../NavbarPostLogin/AlgoliaSearchNavbar/AlgoliaSearchNavbar";
import UserProfileCard from "../common/UserProfileCard/UserProfileCard";
import SubscribeButton from "../common/Button/Button.js";
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
import { db } from "../../Firebase.js";

//Function to display creator page
const Creator = ({ setVideo, video }) => {
  const history = useHistory();
  const location = useLocation();
  console.log(location, "location");
  const creatorsData = JSON.parse(localStorage.getItem("creatorsData"))[0];
  const subscriberVideos = JSON.parse(
    localStorage.getItem("creatorsDataVideos")
  );
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

    {
      location.pathname === "/creator"
        ? window.location.reload()
        : history.push("/creator");
    }
  };

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
  console.log(updatedSubscribersList, "updated");
  }, []);

  const [Banner, setBanner] = useState("");
  const [ProfilePic, setProfilePic] = useState("");
  const [subscriberCount, setSubscriberCount] = useState("");

  getDoc(docRef).then((docSnap) => {
    setBanner(docSnap.data().BannerUrl);
    setProfilePic(docSnap.data().ProfilePictureUrl);
    setSubscriberCount(docSnap.data().SubscriberCount);
  });


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
    <>

      <AlgoliaSearchNavbar
        autocomplete={autocomplete}
        searchInput={searchInput}
      />

      <div className="MainProfileDiv">
        {showSearchResults && (
          <p class="text-start">
            <h2 className="video__category__title p-4">Search Results</h2>
            <div className="video-row">
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
                      | {video.Username} | {video.Likes} Likes | {video.Views}{" "}
                      Views{" "}
                    </p>
                  </div>
                ))}
            </div>

            <div className="video-row">
              {searchResultsUsersArr &&
                searchResultsUsersArr.map((user, index) => (
                  <UserProfileCard
                    id={index}
                    profileImg={user.ProfilePictureUrl}
                    username={user.Username}
                    subscribersCount={`${user.SubscriberCount} Subscribers`}
                    onClick={() => {
                      subscribeUser(user.Username);
                    }}
                    handleUserClick={() => handleCreatorProfile(user.Username)}
                  />
                ))}
            </div>
          </p>
        )}
        <div className="profile-container">
          <div className="top-portion">
            <div className="user-profile-bg-image">
              <img
                id="prf-bg-img"
                src={creatorsData.BannerUrl}
                alt=""
                srcSet=""
              />
            </div>

          </div>

          <div className="middle-portion">
            <div className="user-profile-img">
              <img id="prf-img" src={ProfilePic} alt="" srcSet="" />

              <div className={"userName"}> {creatorName} </div>
              <div className={"subscribers-profile"}>
                {" "}
                {subscriberCount} subscribers{" "}
              </div>
            </div>
          </div>
          <div className="bottom-portion">

            <div className="right-side">
              <SubscribeButton
                color="error"
                onClick={() => {
                  updatedSubscribersList?.includes(creatorsData.Username)
                    ? unSubscribeUser(creatorsData.Username)
                    : subscribeUser(creatorsData.Username);
                }}
                buttonTitle={
                  updatedSubscribersList?.includes(creatorsData.Username)
                    ? "Unsubscribe"
                    : "Subscribe"
                }
                buttonStyling={{ marginTop: "-22.5px" }}
              />
            </div>
            <UserInfo
              dateJoined={creatorsData.DateJoined}
              subscribers={creatorsData.Subscribers}
              videosPostedCount={creatorsData.VideosPosted}
            />

            <div className="left-side"></div>
            <Feed
              subscriberVideos={subscriberVideos}
              setVideo={setVideo}
              displayTabs="none"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Creator;
