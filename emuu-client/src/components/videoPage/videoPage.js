import {useState , useEffect} from 'react';

function Video ({video , setVideo}){


return(
<div className="videoPage">
<video src={video.VideoUrl} controls></video>
<h2>{video.VideoTitle}</h2>
</div>
)
}


export default Video;