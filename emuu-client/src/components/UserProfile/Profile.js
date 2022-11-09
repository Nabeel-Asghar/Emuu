import React, { useState, useMemo, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import "./Profile.scss";
import "../../Firebase.js";
import Feeds from "./Feeds";
import UserInfo from "./UserInfo";
import SubscribersList from "./SubscribersList";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../Firebase.js";
import { Link, useHistory, useLocation } from "react-router-dom";
import { createAutocomplete } from "@algolia/autocomplete-core";
import AlgoliaSearchNavbar from "../NavbarPostLogin/AlgoliaSearchNavbar/AlgoliaSearchNavbar";
import UserProfileCard from "../common/UserProfileCard/UserProfileCard";
import {
  getDoc,
  getDocs,
  setDoc,
  doc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

function Profile() {
  const history = useHistory();
  const location = useLocation();
  const [percent, setPercent] = useState(0);
  const displayName = localStorage.getItem("displayName");
  const docRef = doc(db, "Users", displayName);
  const [autocompleteState, setAutocompleteState] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [count, setCount] = useState(0);
  const [video, setVideo] = useState("");

  function verifyJpeg(filename) {
    const fnArr = filename.split(".");
    if (fnArr[fnArr.length - 1] == "jpeg" || fnArr[fnArr.length - 1] == "jpg")
      return true;
    return false;
  }

  function uploadBackground(e) {
    let file = e.target.files[0];

    if (!verifyJpeg(file.name)) return;
    const storage = getStorage();
    const storageRef = ref(storage, "/images/" + file.name);

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(storageRef).then((URL) =>
        setDoc(
          docRef,
          {
            BannerUrl: URL,
          },
          {
            merge: true,
          }
        )
      );
    });
  }

  function uploadProfile(e) {
    let file = e.target.files[0];
    if (!verifyJpeg(file.name)) return;
    const storage = getStorage();
    const storageRef = ref(storage, "/images/" + file.name);

    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(storageRef).then((URL) =>
        setDoc(
          docRef,
          {
            ProfilePictureUrl: URL,
          },
          {
            merge: true,
          }
        )
      );
    });
  }

  const [Banner, setBanner] = useState("");
  const [ProfilePic, setProfilePic] = useState("");

  getDoc(docRef).then((docSnap) => {
    setBanner(docSnap.data().BannerUrl);
    setProfilePic(docSnap.data().ProfilePictureUrl);
  });

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

  const subscribeUser = () => {
    console.log("subscribed");
  };
  const subscribersCount = localStorage.getItem("subscribersCount");

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
              <img id="prf-bg-img" src={Banner} alt="" srcSet="" />
              <input
                style={{ display: "none" }}
                id="background-inp"
                type="file"
                onChange={(e) => uploadBackground(e)}
                accept="image/jpeg"
              />
              <button
                id="background-change"
                onClick={() =>
                  document.querySelector("#background-inp").click()
                }
              >
                {" "}
                <AddIcon />
              </button>
            </div>

            <div className="user-profile-img">
              <img id="prf-img" src={ProfilePic} alt="" srcSet="" />
              <input
                style={{ display: "none" }}
                id="profile-inp"
                type="file"
                onChange={(e) => uploadProfile(e)}
                accept="image/jpeg"
              />
              <button
                id="profile-change"
                onClick={() => document.querySelector("#profile-inp").click()}
              >
                {" "}
                <AddIcon />
              </button>
              <div className={"userName"}> {displayName} </div>
            </div>
          </div>
          <div className="bottom-portion">
            <div className="right-side" />
            <div style={{ display: "flex", flexDirection: "row" }}>
              <UserInfo subscribersCount={subscribersCount} />
              <SubscribersList />
            </div>
            <div className="left-side"></div>
            <Feeds />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
