import React from "react";
import "./Video.scss";

const Video = ({ id, height, src, title }) => {
  return (
    <div id={id}>
      <video autoplay controls height={height} src={src}></video>
      <div className="video__details__container">
        <div className="video__description__container">
          <p className="video__title">{title}</p>
          <p className="video__details"></p>
          <div className="video__stats">
            <span className="dot"></span>
            <p className="video__details"></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;
