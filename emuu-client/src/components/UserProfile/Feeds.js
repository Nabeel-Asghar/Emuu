import React, { useEffect, useState } from "react";
import "./Feeds.scss";
import { Avatar } from "@mui/material";

import YouTubeJSON from "../data/youtube-videos.json";
import { AxiosContext } from "react-axios/lib/components/AxiosProvider";

const [countUp, setCountUp] = useState(0)
const [countDown, setCountDown] = useState(0)

function Feeds() {
const [countUp, setCountUp] = useState(0)
const [countDown, setCountDown] = useState(0)
  return (
    <div className="feed-container">
      <h3 className="feed__heading">Feed</h3>
      <div className="videos__container">
        {YouTubeJSON.map((video) => (
          <div className="video__container" key={video.id}>
          <Button onClick={() => setCountUp(countUp + 1)}><ThumbUpIcon />{`${countUp === 0 ? ' ' : countUp}`}</Button><Button onClick={() => setCountDown(countDown + 1)}><ThumbDownIcon />{`${countDown === 0 ? ' ' : countDown}`}</Button>
            <iframe
              width="390"
              height="270"
              src={video.url}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="video__details__container">
              <div className="avatar__container">
                <Avatar
                  src="https://wallpaperaccess.com/full/170249.jpg"
                  alt="avatar-alt"
                />
              </div>
              <div className="video__description__container">
                <p className="video__title">{video.title}</p>
                <div className="video__stats">
                  <p className="video__details">{video.views}</p>
                  <span className="dot"></span>
                  <p className="video__details">{video.uploaded}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feeds;
