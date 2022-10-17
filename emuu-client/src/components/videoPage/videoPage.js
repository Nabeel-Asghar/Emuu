import { useState, useEffect } from "react";
import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

function Video({ video, setVideo }) {
  useEffect(() => {
    if (video) localStorage.setItem("video", JSON.stringify(video));
    else {
      if (localStorage.getItem("video"))
        setVideo(JSON.parse(localStorage.getItem("video")));
      else {
        window.location.pathname = "/"; //redirects to home
      }
    }
  }, []);

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
            />
          }
          label="Like"
        />
      </p>
      <p>Posted By: {video.Username} on </p>
      <p>Game Tag: {video.GameTag}</p>
      <h3> Comments </h3>
    </div>
  );
}

export default Video;
