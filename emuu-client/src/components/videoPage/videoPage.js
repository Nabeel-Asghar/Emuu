import { useState, useEffect } from "react";
import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Button from "react-bootstrap/Button";
import TextField from "@mui/material/TextField";
import { db } from "../../Firebase.js";
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

function Video({ video, setVideo }) {
  const displayName = localStorage.getItem("displayName");
  const [checked, setChecked] = useState(false);
  function checkLiked() {
    let liked = video?.usersThatLiked?.includes(displayName); //check if there is a video and if there are users that liked stored
    if (liked) {
    setChecked(true);
    }
    else {
    setChecked(false);
    }
  }

  useEffect(async () => {
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
      setVideo((await getDoc(videoRef)).data());
    }
    if (!video && !localStorage.getItem("video")) {  //if there's no video on this page, redirect to home
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
    <div className="videoPage">
      <video controls height="500" src={video.VideoUrl}></video>
      <h2>{video.VideoTitle}</h2>
      <p>
        {video.VideoDescription} | {video.Likes} Likes | {video.Views} Views
        |&ensp;
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
      </p>
      <p>Posted By: {video.Username} on </p>
      <p>Game Tag: {video.GameTag}</p>
      <TextField
        id="standard-textarea"
        label="Enter a comment"
        placeholder=""
        multiline
        variant="standard"
        value={comment}
        onChange={handleComments}
      />{" "}
      <p></p>
      <button
        class="btn btn-primary"
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
      {video.Comments && (
        <div className="comments">
          <h2>Comments</h2>
          {video.Comments.map((comment) => (
            <div className="comment">
              <p>
                <h3>{comment.text}</h3>
              </p>
              <p>
                <h5>
                  Posted by {comment.postedBy} on {comment.date}
                </h5>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Video;
