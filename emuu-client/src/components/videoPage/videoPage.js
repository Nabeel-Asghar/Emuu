import { useState, useEffect } from "react";
import React from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import Button from 'react-bootstrap/Button';
import TextField from '@mui/material/TextField';
import { db } from "../../Firebase.js";
import {getDocs , getDoc, collection , doc , where, query, updateDoc, increment, arrayUnion} from "firebase/firestore"


function Video({ video, setVideo }) {

  useEffect(async () => {
  if(video ){
   localStorage.setItem("video", JSON.stringify(video));

            }
            if(localStorage.getItem('video')){
            let video = JSON.parse(localStorage.getItem('video'))
             const collectionRef = collection(db , "Videos");
                               const queryData = await query(collectionRef, where("VideoUrl", "==", video.VideoUrl));
                               const _doc = await getDocs(queryData);
                               let id =""
                               _doc.forEach(doc => id= doc.id);
                               const videoRef = doc(db , "Videos", id);
                               setVideo((await getDoc(videoRef)).data())};
            if(!video && !localStorage.getItem("video")){
            window.location.pathname='/';
            }


  }, []);



  const [comment, setComment] = React.useState('');

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
              onChange={ async e=> {
              const collectionRef = collection(db , "Videos");
              const queryData = await query(collectionRef, where("VideoUrl", "==", video.VideoUrl));
              const _doc = await getDocs(queryData);
              let id =""
              _doc.forEach(doc => id= doc.id);
              const videoRef = doc(db , "Videos", id);
              const displayName = localStorage.getItem("displayName");
          if(e.target.checked){
          await updateDoc(videoRef, {Likes: increment(1)});
          await updateDoc(videoRef, {usersThatLiked: arrayUnion(displayName)});
          }
          else{
          await updateDoc(videoRef, {Likes: increment(-1)});
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
      <h3> Comments </h3>
        <TextField
                 id="standard-textarea"
                 label="Enter a comment"
                 placeholder=""
                 multiline
                 variant="standard"
                 value={comment}
                 onChange={handleComments}
               /> <p></p>
        <button class="btn btn-primary" type="submit">Submit</button>
    </div>
  );
}

export default Video;
