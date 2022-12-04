import { useState, useEffect, useMemo } from "react";
import React from "react";
import "./videoPage.scss";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import FormControl from "@mui/material/FormControl";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import TextField from "@mui/material/TextField";
import AlgoliaSearchNavbar from "../NavbarPostLogin/AlgoliaSearchNavbar/AlgoliaSearchNavbar";
import UserProfileCard from "../common/UserProfileCard/UserProfileCard";
import { createAutocomplete } from "@algolia/autocomplete-core";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { Avatar } from "@mui/material";
import Typography from "@mui/material/Typography";
import axios from "axios";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

import { Link, useHistory, useLocation } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
function Video({ video, setVideo }) {
  const [commentList, setCommentList] = useState(video?.Comments || []);
  const displayName = localStorage.getItem("displayName");
  const [checked, setChecked] = useState(false);
  const [dislikeChecked, setDislikeChecked] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const [autocompleteState, setAutocompleteState] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [count, setCount] = useState(0);
  const ProfilePic = localStorage.getItem("ProfilePictureUrl");
  const [firebaseData, setFirebaseData] = useState([]);

  //axios post request to get data for the search bar
  async function getData() {
    const response = await axios.get(
      "https://emuu-cz5iycld7a-ue.a.run.app/auth/firebase-data"
    );
    const users = response.data.message.Users;
    const videos = response.data.message.Videos;
    var completeFirebaseData = videos.concat(users);
    //sets array with user and video data
    setFirebaseData(completeFirebaseData);
  }

  //calls get data function on page load
  useEffect(async () => {
    await getData();
  }, []);

  //creates post and get request for creator data
  async function getCreator() {
    const dis = {
      displayName: video.Username,
    };

    //sends post request of creators name to server
    await axios
      .post(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/creator",
        JSON.stringify({ ...dis })
      )
      .then(function (response) {});

    //sends get request to receive creators details
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

  const dataSet = autocompleteState?.collections?.[0]?.items;
  const searchResultsVideosArr = dataSet?.filter(
    (obj) => obj.hasOwnProperty("VideoUrl") && obj.hasOwnProperty("Username")
  );
  const searchResultsUsersArr = dataSet?.filter(
    (obj) => !obj.hasOwnProperty("VideoUrl") && obj.hasOwnProperty("Username")
  );
  const showSearchResults =
    searchResultsVideosArr?.length > 0 || searchResultsUsersArr?.length > 0;

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

  const subscribeUser = () => {};

  //sends axios post and get request to display recommended videos on video page
  async function getRecommended() {
    const VideoURLAndTag = {
      videoUrl: video.VideoUrl,
      gameTag: video.GameTag,
    };
    //sends video title and game tag for a post request to server
    await axios
      .post(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/recommended",
        JSON.stringify({ ...VideoURLAndTag })
      )
      .then(function (response) {});
    try {
      //gets recommended videos as a map string array
      const response = await axios.get(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/recommended"
      );
      //stores recommended videos into a useState array
      setRecommendedVideos(response.data.message.RecommendedVideos);
    } catch (error) {}
  }

  //gets recommended videos and creator data upon page load
  useEffect(async () => {
    getRecommended();
    await getCreator();
  }, [video]);
  //sends axios post request to check liked status
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
      //response is a get request to determine if a user has previously liked the video or not
      const response = await axios.get(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/CheckLikeVideo"
      );
      //sets whether or not the like button should be checked when a user enters a video
      setChecked(response.data.message.CheckedValue);
    } catch (error) {}
  }
  //sends axios post request to check disliked status
  async function checkDislikeStatus() {
    await axios
      .post(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/CheckDislikeVideo",
        JSON.stringify({
          displayName: displayName,
          videoUrl: video.VideoUrl,
          DislikedBoolean: !checked,
        })
      )
      .then(function (response) {});
    try {
      //response is a get request to determine if a user has previously disliked the video or not
      const response = await axios.get(
        "https://emuu-cz5iycld7a-ue.a.run.app/auth/CheckDislikeVideo"
      );
      //sets whether or not the dislike button should be checked when a user enters a video
      setDislikeChecked(response.data.message.CheckedValue);
    } catch (error) {}
  }

  //axios post request to update view count upon page load
  async function SetView() {
    await axios.post(
      "https://emuu-cz5iycld7a-ue.a.run.app/auth/view",
      JSON.stringify({ videoUrl: video.VideoUrl })
    );
    //updates view count when user enters page
    video.Views++;
    sessionStorage.setItem("video", JSON.stringify(video));
  }

  //upon page load, view count, like/dislike check, as well as creator data will run
  useEffect(() => {
    SetView();
    //  }, [video]);
    //  useEffect(() => {
    checkLikeStatus();
    checkDislikeStatus();
    getCreator();
  }, [video]);

  //function when a user likes a video
  async function likeVideo(e) {
    //post request sends user/video data to server
    axios.post(
      "https://emuu-cz5iycld7a-ue.a.run.app/auth/LikeVideo",
      JSON.stringify({
        displayName: displayName,
        videoUrl: video.VideoUrl,
        LikedBoolean: !checked,
      })
    );

    //if a user has the video liked already, and clicks the like button again, the like count will revert and the button will be unchecked.
    if (checked === true) {
      video.Likes--;
      sessionStorage.setItem("video", JSON.stringify(video));
    }
    //if a user has not liked the video already, and clicks the like button, the like count will go up and the button will be checked.
    else {
      video.Likes++;
      sessionStorage.setItem("video", JSON.stringify(video));
    }
    //if the user has disliked the video, upon liking, it will uncheck the dislike button and negate the dislike count
    if (dislikeChecked === true) {
      setDislikeChecked(false);
      video.Dislikes--;
    }
  }
  //function when a user dislikes a video
  async function dislikeVideo(e) {
    //post request sends user/video data to server
    axios.post(
      "https://emuu-cz5iycld7a-ue.a.run.app/auth/DislikeVideo",
      JSON.stringify({
        displayName: displayName,
        videoUrl: video.VideoUrl,
        DislikedBoolean: !dislikeChecked,
      })
    );
    //if a user has the video disliked already, and clicks the dislike button again, the dislike count will revert and the button will be unchecked.
    if (dislikeChecked === true) {
      video.Dislikes--;
      sessionStorage.setItem("video", JSON.stringify(video));
    }
    //if a user has not disliked the video already, and clicks the dislike button, the dislike count will go up and the button will be checked.
    else {
      video.Dislikes++;
      sessionStorage.setItem("video", JSON.stringify(video));
      //if the user has liked the video, upon disliking, it will uncheck the like button and negate the like count
      if (checked === true) {
        setChecked(false);
        video.Likes--;
      }
    }
  }

  localStorage.setItem("CreatorName", video.Username);

  //parses the video and locally stores it to allow users to reload
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

  const [comment, setComment] = useState("");

  const handleComments = (event) => {
    setComment(event.target.value);
  };

  //creates like/dislike ratio for the like/dislike bar
  const total = video.Likes + video.Dislikes;
  const percentageLikes = (video.Likes / total) * 100;
  const percentageDislikes = (video.Dislikes / total) * 100;

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

                          <div className="vidInfo">
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              fontWeight="medium"
                              fontSize="18px"
                            >
                              {video.Likes} Likes &#x2022; {video.Dislikes}{" "}
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
            <p className="vidInfo">
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
              {localStorage.getItem("auth") == "true" && (
                <div className="actions">
                  <div className="btn-group">
                    <span className="likes action-btn">
                      <FormControlLabel
                        control={
                          <Checkbox
                            icon={
                              <ThumbUpOutlinedIcon sx={{ color: "#fff" }} />
                            }
                            checkedIcon={<ThumbUpIcon sx={{ color: "#fff" }} />}
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
                      <FormControlLabel
                        control={
                          <Checkbox
                            icon={
                              <ThumbDownOutlinedIcon sx={{ color: "#fff" }} />
                            }
                            checkedIcon={
                              <ThumbDownIcon sx={{ color: "#fff" }} />
                            }
                            name="Dislike"
                            id="Dislike"
                            checked={dislikeChecked}
                            onChange={async (e) => {
                              setDislikeChecked(!dislikeChecked);
                              dislikeVideo(e);
                            }}
                          />
                        }
                        label={video.Dislikes > 0 ? video.Dislikes : ""}
                      />
                    </span>
                  </div>
                  <div className="bar">
                    <div
                      style={{ width: percentageLikes + "%" }}
                      className="likesC"
                    >
                      {}
                    </div>
                    <div
                      style={{ width: percentageDislikes + "%" }}
                      className="dislikesC"
                    >
                      {}
                    </div>
                  </div>
                </div>
              )}
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

            {localStorage.getItem("auth") == "true" && (
              <div className="createComment">
                <img src={ProfilePic} className="profilePic" alt="Profile" />
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
                      profilePic: ProfilePic,
                    });
                    await axios
                      .post(
                        "https://emuu-cz5iycld7a-ue.a.run.app/auth/comment",
                        JSON.stringify({
                          text: comment,
                          postedBy: displayName,
                          videoUrl: video.VideoUrl,
                          profilePic: ProfilePic,
                        })
                      )
                      .then(function (response) {});
                    const { data } = await axios.get(
                      "https://emuu-cz5iycld7a-ue.a.run.app/auth/comment"
                    );
                    setComment("");
                    setCommentList(data.message.Comments);
                  }}
                >
                  Submit
                </button>
              </div>
            )}

            {commentList?.length ? (
              <div className="comment-list">
                {commentList.map((comment) => (
                  <div className="comment">
                    <h5 className="commentTitle">
                      <img
                        src={comment.ProfilePictureUrl}
                        className="profilePicComment"
                        alt="Profile"
                      />
                      {comment.postedBy}{" "}
                      <span className="commentDate"> {comment.date}</span>{" "}
                    </h5>

                    <p className="commentText">{comment.text}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="videoPageTwo">
          <Typography
            sx={{ textAlign: "left" }}
            component="div"
            className={"vid__category__title"}
          >
            Recommended Videos
          </Typography>

          <div className="recommendations">
            {recommendedVideos &&
              recommendedVideos.map((video, index) => (
                <div className="wrapper">
                  <div className="preview">
                    <Link to="/video">
                      <img
                        width="168"
                        onClick={() => setVideo(video)}
                        alt="thumbnail"
                        src={video.ThumbnailUrl}
                      />
                    </Link>
                  </div>

                  <div class="info">
                    <Link to="/video">
                      <Typography
                        onClick={() => setVideo(video)}
                        noWrap
                        component="p"
                        className="title"
                      >
                        {video.Title}
                      </Typography>
                    </Link>

                    <span className="username">{video.Username}</span>
                    <div className="view-info">
                      <div>{video.Views} views </div>

                      <div> • {video.Date}</div>
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
