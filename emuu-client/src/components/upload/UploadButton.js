import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
import { storage } from "../../Firebase.js";
import "../../Firebase.js";
import { storage } from "../../Firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import PropTypes from "prop-types";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import getData from "../../gameTagAPI.js";
import Alert from "@mui/material/Alert";
import { getAuth } from "firebase/auth";
import axios from "axios";

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
function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          minWidth: 150,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="subtitle" component="div" color="black">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

function FileUpload() {
  //use state for registration variables
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoTag, setVideoTag] = useState("");
  const [videoDate, setVideoDate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [userName, setUserName] = useState("");

  //upload data structure
  const uploadData = {
    user_userName: userName,
    video_title: videoTitle,
    video_description: videoDescription,
    video_gameTags: videoTag,
    video_url: videoUrl,
  };

  //Gets user authentication
  const auth = getAuth();
  const user = auth.currentUser;


  // Store uploaded file
  const [file, setFile] = useState("");

  //Store percent
  const [percent, setPercent] = useState(0);

  //File upload
  function handleChange(event) {
    setFile(event.target.files[0]);
    setUserName(user.displayName);
  }
  //If a user doesn't choose a file and tries to upload, error will appear
  const handleUpload = async (e) => {
    if (!file) {
      alert("Please upload a video first!");
    }

    //Restrict file size to 5 MB ~ equivalent to 30 second video
    if (file.size > 40 * 1024 * 1024) {
      alert("File size exceeds maximum allowed!");
      return;
    }

    //Store into video folder in firebase storage
    const storageRef = ref(
      storage,
      `/videos/${file.name + new Date().getTime()}`
    );

    //Upload to firebase function
    const uploadTask = uploadBytesResumable(storageRef, file);

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
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setVideoUrl(url);
        });
      }
    );

    //axios request to post upload information to backend
    await axios
      .post("http://localhost:8080/auth/upload", JSON.stringify(uploadData))
      .then((result) => {
        console.log("User information is sent to firestore");
      });
  };

  return (
    <div>
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
          <input
            type="text"
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            className="form-control"
            placeholder="Description of Video"
          />
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
      <input type="file" onChange={handleChange} accept="video/mp4" />
      <button
        onClick={() => handleUpload()}
        type="submit"
        className="btn btn-primary"
      >
        Upload
      </button>
      <p>
        {" "}
        <CircularProgressWithLabel value={percent} />{" "}
      </p>
    </div>
  );
}

export default FileUpload;
