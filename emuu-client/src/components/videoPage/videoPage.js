import { useState, useEffect, useMemo } from "react";
import React from "react";
import "./videoPage.scss";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpAltTwoTone from "@mui/icons-material/ThumbUpAltTwoTone";
import FormControl from "@mui/material/FormControl";

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
import Typography from "@mui/material/Typography";
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
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
function Video({ video, setVideo, setUserProfile }) {

  const [commentList, setCommentList] = useState(video?.Comments || [])
  const displayName = localStorage.getItem("displayName");
  const [checked, setChecked] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const [autocompleteState, setAutocompleteState] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [count, setCount] = useState(0);
  const ProfilePic = localStorage.getItem("ProfilePictureUrl");
const [firebaseData, setFirebaseData] = useState([]);
  async function getData() {
      const response = await axios.get(
        "http://localhost:8080/auth/firebase-data"
      );
      const users = response.data.message.Users;
      const videos = response.data.message.Videos;
      var completeFirebaseData = videos.concat(users);
      setFirebaseData(completeFirebaseData);

    }

    useEffect(async () => {
      await getData();
    }, []);
  async function getCreator() {
    const dis = {
      displayName: video.Username,
    };


    await axios
      .post(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/creator",
        JSON.stringify({ ...dis })
      )
      .then(function (response) { });
    const response = await axios.get(
      "https://emuu-cz5iycld7a-ue.a.run.app/auth/creator"
    );
    const user = response.data.message.UserDetails;


    setSubscriberCount(user[0].SubscriberCount);
  }
  const [recommendedVideos, setRecommendedVideos] = useState([]);


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
                return firebaseData?.filter(
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

  const usersArr = firebaseData?.filter(
    (obj) => obj.hasOwnProperty("Username") && !obj.hasOwnProperty("VideoUrl")
  );
  const videosArr = firebaseData?.filter(
    (obj) => obj.hasOwnProperty("Username") && obj.hasOwnProperty("VideoUrl")
  );

  const handleCreatorProfile = (creatorsName) => {
    const creatorsData = usersArr?.filter(
      (user) => user.Username === creatorsName
    );
    const creatorsDataVideos = videosArr?.filter(
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

  const subscribeUser = () => { };

 async function getRecommended() {
   await axios
       .post(
         "https://emuu-cz5iycld7a-ue.a.run.app/auth/recommended",
         JSON.stringify({
           gameTag: video.GameTag,
         })
       )
       .then(function (response) { });
     try {
       const response = await axios.get(
         "https://emuu-cz5iycld7a-ue.a.run.app/auth/recommended"
       );

       //      console.log(response.data.message);
       setRecommendedVideos(response.data.message.RecommendedVideos);
     } catch (error) { }
   }

   useEffect(async () => {
     getRecommended();
     await getCreator()
     }, [video]);

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
      .then(function (response) { });
    try {
      const response = await axios.get(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/CheckLikeVideo"
      );

      setChecked(response.data.message.CheckedValue);
    } catch (error) { }
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
    //  }, [video]);
    //  useEffect(() => {
    checkLikeStatus();
    getCreator()
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
      localStorage.setItem("video", JSON.stringify(video));
    }
    if (localStorage.getItem("video")) {
      setVideo(JSON.parse(localStorage.getItem("video")));
      //console.log(video);
    }
    if (!video && !localStorage.getItem("video")) {
      //if there's no video on this page, redirect to home
      window.location.pathname = "/";
    }
  }, []);

  //    useEffect(() => {
  //      checkLiked();
  //    }, [video]);

  const [comment, setComment] = useState("");

  const handleComments = (event) => {
    setComment(event.target.value);
  };
  const total = video.Likes + (video.Dislikes || 16)
  const percentageLikes = (video.Likes / total) * 100;
  const percentageDislikes = ((video.Dislikes || 16) / total) * 100;
  //console.log("Video",video)
  return (
    <>
      <AlgoliaSearchNavbar
        autocomplete={autocomplete}
        searchInput={searchInput}
      />

      <div className="vp-container">
        <div className="videoPageOne">
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
                      onClick={() => {
                        subscribeUser(user.Username);
                      }}
                      handleUserClick={() =>
                        handleCreatorProfile(user.Username)
                      }
                    />
                  ))}
              </div>
            </p>
          )}
          <video controls height="700" src={video.VideoUrl}></video>
          <div className="title-line">
            <h1 className="title">{video.Title}</h1>
            <p className="videoInfo">
              <div className="details">
                <img
                  src={video.ProfilePic}
                  className="profilePic"
                  alt="Profile"
                />
                <div className="creator">
                  <a
                    className="username"
                    href="/creator"
                    onClick={() => {
                      localStorage.setItem("Creator", video.Username);
                    }}
                  >
                    {video.Username}
                  </a>
                  <span className="subs">{subscriberCount} Subscribers</span>
                </div>
              </div>
              {localStorage.getItem("auth") == "true" && <div className="actions">
                <div className="btn-group">
                  <span className="likes action-btn">
                    <FormControlLabel
                      control={
                        <Checkbox
                          icon={<ThumbUpOutlinedIcon sx={{ color: "#fff" }} />}
                          checkedIcon={
                            <ThumbUpIcon sx={{ color: "#fff" }} />
                          }
                          name="Like"
                          id="Like"
                          checked={checked}
                          onChange={async (e) => {
                            setChecked(!checked);
                            likeVideo(e);
                          }}
                        />
                      }
                      label={video.Likes > 0 ? video.Likes : ""}
                    />


                  </span>

                  <span className="dislikes action-btn">
                    <ThumbDownOutlinedIcon sx={{ color: "#fff" }} />

                  </span>

                </div>
                <div className="bar">

                  <div style={{ width: percentageLikes + "%" }} className="likesC">{video.Likes}</div>
                  <div style={{ width: percentageDislikes + "%" }} className="dislikesC">{video.Dislikes || 20}</div>

                </div>


              </div>}

            </p>
          </div>
          <div className="about">
            <div className="info">
              <h5 className="views">{video.Views} Views</h5>
              <h5 className="views">Posted on {video.Date}</h5>
            </div>
            <div className="description">{video.VideoDescription}</div>
            <br />
            <p className="postedby">Game Tag: {video.GameTag}</p>
          </div>
          <div className="comments-section">
            <h3 className="comment-count">{commentList?.length} Comments</h3>

            {localStorage.getItem("auth") == "true" && <div className="createComment">
              <img
                src={ProfilePic}
                className="profilePic"
                alt="Profile"
              />
              <FormControl fullWidth>
                <TextField
                  id="filled-search"
                  InputLabelProps={{
                    style: { color: "#ededed" },
                  }}
                  InputProps={{ style: { color: "white" } }}
                  sx={{ color: "white" }}
                  label="Write a comment"
                  type="text"
                  value={comment}
                  onChange={handleComments}

                  variant="standard"
                />
              </FormControl>
              <button
                className="submit-btn"
                type="submit"
                onClick={async () => {
                  console.log({
                    text: comment,
                    postedBy: displayName,
                    videoUrl: video.VideoUrl,
                    profilePic:ProfilePic 
                  })
                  await axios
                    .post(
                      "https://emuu-cz5iycld7a-ue.a.run.app/auth/comment",
                      JSON.stringify({
                        text: comment,
                        postedBy: displayName,
                        videoUrl: video.VideoUrl,
                        profilePic:ProfilePic 
                      })
                    )
                    .then(function (response) { });
                  const { data } = await axios.get(
                    "https://emuu-cz5iycld7a-ue.a.run.app/auth/comment"
                  );
                  setComment("");
                  setCommentList(data.message.Comments)
                }}
              >
                Submit
              </button>
            </div>}

            {commentList?.length ? (
              <div className="comment-list">
                {commentList.map((comment) => (
                  <div className="comment">
                    <h5 className="commentTitle">
                      {comment.postedBy} <span className="commentDate"> {comment.date}</span>{" "}
                    </h5>

                    <p className="commentText">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="videoPageTwo">
          <Typography sx={{ textAlign: "left" }} component="div" className={"video__category__title"}>
            Recommended Videos
          </Typography>

          <div className="recommendations">
            {recommendedVideos &&
              recommendedVideos.map((video, index) => (
                <div className="wrapper">
                  <div className="preview">
                    <Link to="/video">
                      <img width="168" onClick={() => setVideo(video)} alt="thumbnail" src={video.ThumbnailUrl} />
                    </Link>

                  </div>

                  <div class="info">
                    <Link to="/video">
                      <Typography onClick={() => setVideo(video)} noWrap component="p" className="title">
                        {video.Title}
                      </Typography>
                    </Link>



                    <span className="username">{video.Username}</span>
                    <div className="view-info">
                      <div>{video.Views} views </div>

                      <div> {" "}• {video.Date}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

      </div>
    </>
  );
}

export default Video;
