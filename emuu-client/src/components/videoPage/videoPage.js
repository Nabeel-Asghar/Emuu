import { useState, useEffect } from "react";
import React from "react";
import "./videoPage.scss";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Button from "react-bootstrap/Button";
import TextField from "@mui/material/TextField";
import { db } from "../../Firebase.js";
import HeaderPostLogin from "../NavbarPostLogin/HeaderPostLogin.js";

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
import { Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
function Video({ video, setVideo, setUserProfile }) {
  const displayName = localStorage.getItem("displayName");
  const [checked, setChecked] = useState(false);

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
      <HeaderPostLogin />
      <div className="videoPage">
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
                  setUserProfile(video);
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
