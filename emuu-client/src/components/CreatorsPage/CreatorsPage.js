import "./UserInfo.scss";
import "./Feeds.scss";
import { Avatar } from "@mui/material";
import React, { useState, useEffect, useMemo } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import "./Profile.scss";
import Checkbox from "@material-ui/core/Checkbox";
import "../../Firebase.js";
import Feeds from "./Feeds";
import SubscribeButton from "./Button.js";
import { createAutocomplete } from "@algolia/autocomplete-core";
import UserProfileCard from "../common/UserProfileCard/UserProfileCard";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { db } from "../../Firebase.js";
import { getDoc, doc } from "firebase/firestore";
import AlgoliaSearchNavbar from "../NavbarPostLogin/AlgoliaSearchNavbar/AlgoliaSearchNavbar";

//Function to display creator page

function Creator({ setVideo, video }) {
  const history = useHistory();
  const displayName = localStorage.getItem("displayName");
  const location = useLocation();
  const creatorName = localStorage.getItem("Creator");
  const [subscriberActionCount, setSubsciberActionCount] = useState(0);
  const [updatedSubscribersList, setUpdateSubscribersList] = useState([]);
  const [autocompleteState, setAutocompleteState] = useState({});
  const [count, setCount] = useState(0);
  const [checked, setChecked] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [Banner, setBanner] = useState("");
  const [CreatorProfilePic, setCreatorProfilePic] = useState("");
  const [subscriberCount, setSubscriberCount] = useState(0);
  //function to get firebase data for search bar
  const [firebaseData, setFirebaseData] = useState([]);
  async function getData() {
  //axios get request to receive firebase data
    const response = await axios.get(
      "http://localhost:8080/auth/firebase-data"
    );
    const users = response.data.message.Users;
    const videos = response.data.message.Videos;
    var completeFirebaseData = videos.concat(users);
    //stores videos and users data into an array
    setFirebaseData(completeFirebaseData);
  }
//runs getData function upon page load
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
                    item.Title?.toLowerCase().includes(
                      query.toLowerCase()
                    ) ||
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
//function to check if a user is subscribed to a creator (this is used to determine if the subscribed button is checked or not)
  async function checkSubStatus() {
    await axios
    //sends axios post of creators and users name
      .post(
        "http://localhost:8080/auth/CheckSubscribe",
        JSON.stringify({
          displayName: displayName,
          creatorName: creatorName,
          LikedBoolean: !checked,
        })
      )
      .then(function (response) {});
    try {
    //receives boolean of whether the user is in this creators subscribers list
      const response = await axios.get(
        "http://localhost:8080/auth/CheckSubscribe"
      );
//sets the boolean for subscriber button to determine whether the button is checked or not
      setChecked(response.data.message.CheckedSubValue);

    } catch (error) {}
  }
//runs checkSubStatus upon page load
  useEffect(() => {
    checkSubStatus();
  }, []);
//function for when user subscribes to creator
  async function subscribeToUser(e) {
    //Axios post to send user and creator data to backend
    axios.post(
      "http://localhost:8080/auth/SubscribeButton",
      JSON.stringify({
        displayName: displayName,
        creatorName: creatorName,
        SubBoolean: !checked,
      })
    );
    //updates subscribe count
    if (checked === true) {
      subscriberCount--;
    } else {
      subscriberCount++;
    }
  }
//function to get creators data
  async function getUser() {
    const dis = {
      displayName: creatorName,
    };
    await axios
    //axios post request of creators name to server
      .post(
        "http://localhost:8080/auth/creator",
        JSON.stringify({ ...dis })
      )
      .then(function (response) {});
//axios get request receives creators data
    const response = await axios.get(
      "http://localhost:8080/auth/creator"
    );
//creators name, banner, profile picture, and subscriber count is set
    const user = response.data.message.UserDetails;

    setBanner(user[0].BannerUrl);

    setCreatorProfilePic(user[0].ProfilePictureUrl);

    setSubscriberCount(user[0].SubscriberCount);
  }
//creators data is pulled upon page load
  useEffect(async () => {
    await getUser();
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

  const usersArr = firebaseData.filter(
    (obj) => obj.hasOwnProperty("Username") && !obj.hasOwnProperty("VideoUrl")
  );
  const videosArr = firebaseData.filter(
    (obj) => obj.hasOwnProperty("Username") && obj.hasOwnProperty("VideoUrl")
  );
  const creatorsData = usersArr.filter((user) => user.Username === creatorName);

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

  useEffect(async () => {
    const userRefInitial = doc(db, "Users", creatorName);
    const getSubscribersListRefInitial = await getDoc(userRefInitial);
    let subscribersListInitial;
    if (getSubscribersListRefInitial.exists()) {
      subscribersListInitial =
        getSubscribersListRefInitial.data()?.SubscriberList;
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
                  <div>
                    <Card sx={{ width: 385, height: 375 }}>
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
                    onClick={() => {}}
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
                <img id="prf-img" src={CreatorProfilePic} alt="" srcSet="" />

                <div className={"userName"}> {creatorName} </div>

                <div className={"subscribers-profile"}>
                  {" "}
                  {subscriberCount} subscribers{" "}
                </div>
                {localStorage.getItem("auth") == "true" && (
                  <div className="right-side">
                    <Checkbox
                      icon={
                        <SubscribeButton
                          color="error"
                          buttonTitle={"Subscribe"}
                          buttonStyling={{ marginTop: "0px" }}
                        />
                      }
                      checkedIcon={
                        <SubscribeButton
                          color="error"
                          buttonTitle={"Unsubscribe"}
                          buttonStyling={{ marginTop: "0px" }}
                        />
                      }
                      checked={checked}
                      onChange={async (e) => {
                        setChecked(!checked);
                        subscribeToUser(e);
                      }}
                    />
                  </div>
                )}
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
