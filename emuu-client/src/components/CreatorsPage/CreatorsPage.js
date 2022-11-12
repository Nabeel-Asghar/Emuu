import "./UserInfo.scss";
import "./Feeds.scss";
import { Avatar } from "@mui/material";
import { AxiosContext } from "react-axios/lib/components/AxiosProvider";
import React, { useState, useEffect, useMemo } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import "./Profile.scss";
import "../../Firebase.js";
import Feeds from "./Feeds";
import SubscribeButton from "./Button.js";
import { createAutocomplete } from "@algolia/autocomplete-core";
import UserProfileCard from "../common/UserProfileCard/UserProfileCard";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import UserInfo from "./UserInfo";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../Firebase.js";
import {
  getDoc,
  getDocs,
  setDoc,
  doc,
  collection,
  query,
  where,
  onSnapshot,
  increment,
  updateDoc,
} from "firebase/firestore";
import AlgoliaSearchNavbar from "../NavbarPostLogin/AlgoliaSearchNavbar/AlgoliaSearchNavbar";

//Function to display creator page

function Creator({ setVideo, video }) {
  const history = useHistory();
  const displayName = localStorage.getItem("displayName");

  const location = useLocation();
  const [creatorName, setCreatorName] = useState("Loading...");
  const [subscriberActionCount, setSubsciberActionCount] = useState(0);
  const [updatedSubscribersList, setUpdateSubscribersList] = useState([]);
  const [autocompleteState, setAutocompleteState] = useState({});
  const [count, setCount] = useState(0);

  const [searchInput, setSearchInput] = useState("");
  const firebaseData = JSON.parse(localStorage.getItem("firebase-data"));

  const docRef = doc(db, "Users", creatorName);

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
    const userRef = doc(db, "Users", creatorName);
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
    const userRef = doc(db, "Users", creatorName);
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

  useEffect(async () => {
    const userRefInitial = doc(db, "Users", creatorName);
    const getSubscribersListRefInitial = await getDoc(userRefInitial);
    let subscribersListInitial;
    if (getSubscribersListRefInitial.exists()) {
      subscribersListInitial =
        getSubscribersListRefInitial.data().SubscriberList;
    }
    setUpdateSubscribersList(subscribersListInitial);
  }, [subscriberActionCount]);

  useEffect(async () => {
    if (video) {
      localStorage.setItem("video", JSON.stringify(video));
      window.location.reload();
      return false;
    }
    if (localStorage.getItem("video")) {
      let video = JSON.parse(localStorage.getItem("video"));
      setCreatorName(video.Username);
    }
  }, []);

  const [Banner, setBanner] = useState("");
  const [ProfilePic, setProfilePic] = useState("");
  const [subscriberCount, setSubscriberCount] = useState("");

  getDoc(docRef).then((docSnap) => {
    setBanner(docSnap.data().BannerUrl);
    setProfilePic(docSnap.data().ProfilePictureUrl);
    setSubscriberCount(docSnap.data().SubscriberCount);
  });

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
                 <div>
                                         <Card sx={{ width: 385, height: 375 }}>
                                           <CardMedia
                                             component="img"
                                             image={video.thumbnailUrl}
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
        <div className="MainProfileDiv">
          <div className="profile-container">
            <div className="top-portion">
              <div className="user-profile-bg-image">
                <img id="prf-bg-img" src={Banner} alt="" srcSet="" />
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
                 <div className="right-side">
                                <SubscribeButton
                                                            color="error"
                                                            onClick={() => {
                                                              updatedSubscribersList?.includes(creatorName)
                                                                ? unSubscribeUser(displayName)
                                                                : subscribeUser(displayName);
                                                            }}
                                                            buttonTitle={
                                                              updatedSubscribersList?.includes(displayName)
                                                                ? "Unsubscribe"
                                                                : "Subscribe"
                                                            }
                                                            buttonStyling={{ marginTop: "-22.5px"
                                                              }}
                                                          />


                              </div>
              </div>
            </div>
            <div className="bottom-portion">


              <div className="left-side"></div>
              <Feeds setVideo={setVideo} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Creator;
