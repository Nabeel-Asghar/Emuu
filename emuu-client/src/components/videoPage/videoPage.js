import {useState , useEffect} from 'react';

function Video ({video , setVideo}){
useEffect(()=>{
if(video)localStorage.setItem('video',JSON.stringify(video));
else{
if(localStorage.getItem('video'))setVideo(JSON.parse(localStorage.getItem('video')));
else{
window.location.pathname="/" //redirects to home
}
}



}, [])

return(
<div className="videoPage">
<video src={video.VideoUrl} controls></video>
<h2>{video.VideoTitle}</h2>
</div>
)
}


export default Video;