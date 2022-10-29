import React from "react";
import "./Feeds.scss";
import { Link } from "react-router-dom";
const Feed = ({ setVideo, subscriberVideos }) => {
  return (
    <div className="feed-container">
      <h3 className="feed__heading">Feed</h3>
      <div className="videos__container">
        {subscriberVideos &&
          subscriberVideos.map((video) => (
            <div>
              <img
                controls
                height="250"
                width="400"
                src={video.thumbnailUrl}
              ></img>
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
                | {video.Username} | {video.Likes} Likes | {video.Views} Views{" "}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Feed;
