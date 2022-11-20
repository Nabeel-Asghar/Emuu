import { useState, useEffect, useMemo } from "react";
import React from "react";
import "./videoPage.scss";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Button from "react-bootstrap/Button";
import TextField from "@mui/material/TextField";
import { db } from "../../Firebase.js";
import AlgoliaSearchNavbar from "../NavbarPostLogin/AlgoliaSearchNavbar/AlgoliaSearchNavbar";
import UserProfileCard from "../common/UserProfileCard/UserProfileCard";
import { createAutocomplete } from "@algolia/autocomplete-core";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { Avatar } from "@mui/material";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import {
  getDocs,
  getDoc,
  collection,
  doc,
  where,
  query,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Link, useHistory, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
function Video({ video, setVideo, setUserProfile }) {
  const displayName = localStorage.getItem("displayName");
  const [checked, setChecked] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const [autocompleteState, setAutocompleteState] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [count, setCount] = useState(0);
  const creatorRouteName = video.Username;
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

  const subscribeUser = () => {};

  async function checkLikeStatus() {
    await axios
      .post(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/CheckLikeVideo",
        JSON.stringify({
          displayName: displayName,
          videoUrl: video.VideoUrl,
          LikedBoolean: !checked,
        })
      )
      .then(function (response) {});
    try {
      const response = await axios.get(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/CheckLikeVideo"
      );

      setChecked(response.data.message.CheckedValue);
    } catch (error) {}
  }
  async function SetView() {
    await axios.post(
      "https://emuu-cz5iycld7a-ue.a.run.app/auth/view",
      JSON.stringify({ videoUrl: video.VideoUrl })
    );
    video.Views++;
    sessionStorage.setItem("video", JSON.stringify(video));
  }
  useEffect(() => {
    SetView();
  }, [video]);
  useEffect(() => {
    checkLikeStatus();
  }, [video]);

  async function likeVideo(e) {
    //Axios post should be done here to send info to backend
    axios.post(
      "https://emuu-cz5iycld7a-ue.a.run.app/auth/LikeVideo",
      JSON.stringify({
        displayName: displayName,
        videoUrl: video.VideoUrl,
        LikedBoolean: !checked,
      })
    );
    if (checked === true) {
      video.Likes--;
      sessionStorage.setItem("video", JSON.stringify(video));
    } else {
      video.Likes++;
      sessionStorage.setItem("video", JSON.stringify(video));
    }
  }

  localStorage.setItem("CreatorName", video.Username);
  useEffect(async () => {
    if (video) {
      sessionStorage.setItem("video", JSON.stringify(video));
    }
    if (sessionStorage.getItem("video")) {
      setVideo(JSON.parse(sessionStorage.getItem("video")));
      //console.log(video);
    }
    if (!video && !localStorage.getItem("video")) {
      //if there's no video on this page, redirect to home
      window.location.pathname = "/";
    }
  }, []);

  //   useEffect(() => {
  //     checkLiked();
  //   }, [video]);

  const [comment, setComment] = useState("");

  const handleComments = (event) => {
    setComment(event.target.value);
  };

  return (
    <>
      <AlgoliaSearchNavbar
        autocomplete={autocomplete}
        searchInput={searchInput}
      />
      <div className="videoPage">
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
                                               <Avatar sx={{ width: 60, height: 60 }}  src={video.ProfilePic}></Avatar>
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
                    onClick={() => {
                      subscribeUser(user.Username);
                    }}
                    handleUserClick={() => handleCreatorProfile(user.Username)}
                  />
                ))}
            </div>
          </p>
        )}
        <video controls height="700" src={video.VideoUrl}></video>
        <div className="title-line">
          <h1 class="title">{video.Title}</h1>
          <p class="videoInfo">
            {video.Likes} Likes &#x2022; {video.Views} Views
            {localStorage.getItem("auth") == "true" && (
              <>
                &#x2022;&ensp;
                <FormControlLabel
                  control={
                    <Checkbox
                      icon={<FavoriteBorder />}
                      checkedIcon={<Favorite />}
                      name="Like"
                      id="Like"
                      checked={checked}
                      onChange={async (e) => {
                        setChecked(!checked);
                        likeVideo(e);
                      }}
                    />
                  }
                  label="Like"
                />
              </>
            )}
          </p>
        </div>
        <div className="about">
          <h2>About</h2>
          <div className="description">{video.VideoDescription}</div>
          <p className="description">
            Posted By:{" "}
            <Link
              to="/creator"
              onClick={() => {
                localStorage.setItem("Creator", video.Username);
              }}
            >
              {""}
              {video.Username}
            </Link>{" "}
            on {video.Date}
          </p>
          <p className="description">Game Tag: {video.GameTag}</p>
        </div>
        {localStorage.getItem("auth") == "true" && (
          <div className="post-comment">
            <TextField
              id="standard-textarea"
              label="Enter a comment"
              placeholder=""
              multiline
              variant="standard"
              size="normal"
              value={comment}
              onChange={handleComments}
            />{" "}
            <p></p>
            <button
              class="btn btn-lg btn-primary"
              type="submit"
              onClick={async () => {
                await axios
                  .post(
                    "https://emuu-cz5iycld7a-ue.a.run.app/auth/comment",
                    JSON.stringify({
                      text: comment,
                      postedBy: displayName,
                      videoUrl: video.VideoUrl,
                    })
                  )
                  .then(function (response) {});
                const response = await axios.get(
                  "https://emuu-cz5iycld7a-ue.a.run.app/auth/comment"
                );
                setComment(response.data.message.Comments);
              }}
            >
              Submit
            </button>
          </div>
        )}

        {video.Comments && (
          <div className="comment-section">
            <h2>Comments</h2>
            {video.Comments.map((comment) => (
              <div className="comment">
                <p>
                  {comment.postedBy}&#x2022;
                  <span style={{ opacity: 0.5 }}>{comment.date}</span>
                </p>
                <p>{comment.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Video;
