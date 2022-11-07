import { createTheme, ThemeProvider } from "@mui/material/styles";

import React, { useEffect, useState } from "react";
import { storage, db } from "../../Firebase.js";

import "../../Firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import PropTypes from "prop-types";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import { getAuth } from "firebase/auth";
import axios from "axios";

import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HeaderPostLogin from "../NavbarPostLogin/HeaderPostLogin";
import { setDoc, doc, increment, updateDoc } from "firebase/firestore";

const theme = createTheme({
  palette: {
    primary: {
      light: "#484848",
      main: "#212121",
      dark: "#000000",
      contrastText: "#fff",
    },
    secondary: {
      light: "#6bffff",
      main: "#0be9d0",
      dark: "#00b69f",
      contrastText: "#000",
    },
  },
});
function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <div class="col-sm-6 offset-sm-3">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    </div>
  );
}

function FileUpload() {
  //use state for registration variables
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoTag, setVideoTag] = useState("");
  const [videoDate, setVideoDate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const displayName = localStorage.getItem("displayName");
  const docRef = doc(db, "Users", displayName);
  //upload data structure
  const uploadData = {
    user_userName: userName,
    video_title: videoTitle,
    video_description: videoDescription,
    video_gameTags: videoTag,
    video_url: videoUrl,
    thumbnail_url: thumbnailUrl,
  };

  //Gets user authentication
  const auth = getAuth();
  const user = auth.currentUser;

  // Store uploaded file
  const [file, setFile] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  //Store percent
  const [percent, setPercent] = useState(0);

  //File upload
  function handleChange(event) {
    setFile(event.target.files[0]);
    setUserName(user.displayName);
  }
  function handleThumbnail(event) {
    setThumbnail(event.target.files[0]);
  }
  //If a user doesn't choose a file and tries to upload, error will appear
  const handleUpload = async (e) => {
    if (!file) {
      alert("Please upload a video first!");
    }

    //Restrict file size to 5 MB ~ equivalent to 30 second video
    if (file.size > 100 * 1024 * 1024) {
      alert("File size exceeds maximum allowed!");
      return;
    }

    //Store video into video folder in firebase storage
    const storageRef = ref(
      storage,
      `/videos/${file.name + new Date().getTime()}`
    );
    //Store thumbnail in thumbnail folder in firebase storage
    const storageRefThumb = ref(
      storage,
      `/thumbnail/${thumbnail.name + new Date().getTime()}`
    );
    //Upload to firebase function
    const uploadTask = uploadBytesResumable(storageRef, file);
    const uploadTaskThumb = uploadBytesResumable(storageRefThumb, thumbnail);

    //thumbnail upload
    uploadTaskThumb.on(
      "state_changed",
      (snapshot) => {},
      (err) => console.log(err),
      (snapshot) => {
        // download url
        getDownloadURL(uploadTaskThumb.snapshot.ref).then((URL) => {
          if (!URL) {
            setUploadStatus(
              <span style={{ color: "red" }}>
                <ErrorOutlineIcon /> Try again
              </span>
            );
            return;
          }
          setThumbnailUrl(URL);
          console.log(URL);
        });
      }
    );

    //Video and axios upload
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100 //percent display
        );

        // update percent
        setPercent(percent);
      },
      (err) => console.log(err),
      (snapshot) => {
        // download url

        getDownloadURL(uploadTask.snapshot.ref).then((URL) => {
          if (!URL) {
            setUploadStatus(
              <span style={{ color: "red" }}>
                <ErrorOutlineIcon /> Try again
              </span>
            );
            return;
          }
          setVideoUrl(URL);
          console.log(URL);
        });
      }
    );
  };

  useEffect(async () => {
    if (videoUrl && thumbnailUrl) {
      await axios
        .post(
          "http://localhost:8080/auth/upload",
          JSON.stringify({ ...uploadData })
        )
        .then((result) => {
          setUploadStatus(
            <span style={{ color: "green" }}>
              <CheckCircleOutlineIcon /> Upload successful
            </span>
          );
        });
    }
  }, [videoUrl, thumbnailUrl]);

  return (
    <div>
      <HeaderPostLogin />
      <h1>Upload a Video</h1>
      <form id="videoUploadForm" method="POST">
        <div className="col-sm-6 offset-sm-3">
          <input
            type="text"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            className="form-control"
            placeholder="Video Title"
          />
          <br />
        </div>

        <div class="col-sm-6 offset-sm-3">
          <textarea
            type="text"
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            className="form-control"
            placeholder="Description of Video"
            rows="3"
          ></textarea>
          <br />
        </div>
        <div className="col-sm-6 offset-sm-3">
          <input
            type="text"
            value={videoTag}
            onChange={(e) => setVideoTag(e.target.value)}
            className="form-control"
            placeholder="Game Tag"
          />
          <br />
        </div>
      </form>
      <h2>Please Choose a Video</h2>
      <input type="file" onChange={handleChange} accept="video/mp4" />
      <br />
      <br />

      <h2>Please Choose a Thumbnail</h2>
      <input type="file" onChange={handleThumbnail} accept="image/jpeg" />

      <p>
        {" "}
        <LinearProgressWithLabel value={percent} />{" "}
      </p>
      <button
        onClick={() => handleUpload()}
        type="submit"
        className="btn btn-primary"
      >
        Upload
      </button>
      {uploadStatus}
    </div>
  );
}

export default FileUpload;
