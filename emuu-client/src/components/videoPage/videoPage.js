import React, { useState, useEffect, useMemo } from "react";
import "./videoPage.scss";
import { Link, useHistory, useLocation} from "react-router-dom";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Button from "react-bootstrap/Button";
import TextField from "@mui/material/TextField";
import { createAutocomplete } from "@algolia/autocomplete-core";
import { db } from "../../Firebase.js";
import AlgoliaSearchNavbar from "../NavbarPostLogin/AlgoliaSearchNavbar/AlgoliaSearchNavbar";
import UserInfoNew from "../CreatorsPage/UserInfo";
import UserProfileCard from "../common/UserProfileCard/UserProfileCard";
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
import { getAuth, onAuthStateChanged } from "firebase/auth";
function Video({ video, setVideo, setUserProfile }) {
  const displayName = localStorage.getItem("displayName");
  const [checked, setChecked] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const [autocompleteState, setAutocompleteState] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [count, setCount] = useState(0);

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

      {location.pathname==="/creator" ? window.location.reload():history.push("/creator");}
    };

    const subscribeUser = () => {
        console.log("subscribed");
      };



  function checkLiked() {
    let liked = video?.usersThatLiked?.includes(displayName); //check if there is a video and if there are users that liked stored
    if (liked) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }
  localStorage.setItem("CreatorName", video.Username);
  useEffect(async () => {
    console.log(getAuth());
    if (video) {
      localStorage.setItem("video", JSON.stringify(video));
    }
    if (localStorage.getItem("video")) {
      let video = JSON.parse(localStorage.getItem("video"));
      const collectionRef = collection(db, "Videos");
      const queryData = await query(
        collectionRef,
        where("VideoUrl", "==", video.VideoUrl)
      );
      const _doc = await getDocs(queryData);
      let id = "";
      _doc.forEach((doc) => (id = doc.id));
      const videoRef = doc(db, "Videos", id);
      await updateDoc(videoRef, { Views: increment(1) });
      setVideo((await getDoc(videoRef)).data());
    }
    if (!video && !localStorage.getItem("video")) {
      //if there's no video on this page, redirect to home
      window.location.pathname = "/";
    }
  }, []);

  useEffect(() => {
    checkLiked();
  }, [video]);

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
        <video controls height="700" src={video.VideoUrl}></video>
        <div className="title-line">
          <h1 class="title">{video.VideoTitle}</h1>
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
                        const collectionRef = collection(db, "Videos");
                        const queryData = await query(
                          collectionRef,
                          where("VideoUrl", "==", video.VideoUrl)
                        );
                        const _doc = await getDocs(queryData);
                        let id = "";
                        _doc.forEach((doc) => (id = doc.id));
                        const videoRef = doc(db, "Videos", id);
                        if (e.target.checked) {
                          await updateDoc(videoRef, { Likes: increment(1) });
                          await updateDoc(videoRef, {
                            usersThatLiked: arrayUnion(displayName),
                          });
                        } else {
                          await updateDoc(videoRef, { Likes: increment(-1) });
                          await updateDoc(videoRef, {
                            usersThatLiked: arrayRemove(displayName),
                          });
                        }
                        setVideo((await getDoc(videoRef)).data());
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
            <Link to="/creator">
              {""}
              <span
                onClick={() => {
                  handleCreatorProfile(video.Username);
                }}
              >
                {video.Username}
              </span>
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
                setComment("");
                const collectionRef = collection(db, "Videos");
                const queryData = await query(
                  collectionRef,
                  where("VideoUrl", "==", video.VideoUrl)
                );
                const _doc = await getDocs(queryData);
                let id = "";
                _doc.forEach((doc) => (id = doc.id));
                const videoRef = doc(db, "Videos", id);
                await updateDoc(videoRef, {
                  Comments: arrayUnion({
                    text: comment,
                    postedBy: displayName,
                    date: new Date().toLocaleDateString(),
                  }),
                });
                setVideo((await getDoc(videoRef)).data());
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
