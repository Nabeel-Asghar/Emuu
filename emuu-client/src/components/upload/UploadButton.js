import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState, useMemo } from "react";
import "../home/Home.scss";

import { storage } from "../../Firebase.js";
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
import { createAutocomplete } from "@algolia/autocomplete-core";
import { Link,useHistory, useLocation } from "react-router-dom";
import AlgoliaSearchNavbar from "../NavbarPostLogin/AlgoliaSearchNavbar/AlgoliaSearchNavbar";
import UserProfileCard from "../common/UserProfileCard/UserProfileCard";
import Sidebar from "../Sidebar/Sidebar";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HeaderPostLogin from "../NavbarPostLogin/HeaderPostLogin";
import AppContext from "../../AppContext";

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

function FileUpload({ setVideo }) {
  //use state for registration variables
  const history = useHistory();
  const location = useLocation();
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoTag, setVideoTag] = useState("");
  const [videoDate, setVideoDate] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const [autocompleteState, setAutocompleteState] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [count, setCount] = useState(0);

  const firebaseData = JSON.parse(localStorage.getItem("firebase-data"));

  const autocomplete = useMemo(
    () =>
      createAutocomplete({
        onStateChange({ state }) {
          setAutocompleteState(state);
          setSearchInput(state.query);
          if (count === 0) {
            setCount((count) => count + 1);
          }
        },
        getSources() {
          return [
            {
              sourceId: "pages-source",
              getItemInputValue({ item }) {
                // search item
                return item.query;
              },
              getItems({ query }) {
                // takes your search input and checks if anything that matches it exists in your dataset
                if (!query) {
                  return firebaseData;
                }
                return firebaseData.filter(
                  (item) =>
                    item.VideoTitle?.toLowerCase().includes(
                      query.toLowerCase()
                    ) ||
                    item.Username?.toLowerCase().includes(
                      query.toLocaleLowerCase()
                    )
                );
              },
              templates: {
                item({ item }) {
                  return item.VideoTitle || item.Username;
                },
              },
            },
          ];
        },
      }),
    [count]
  );

  const dataSet = autocompleteState?.collections?.[0]?.items;
  const searchResultsVideosArr = dataSet?.filter(
    (obj) => obj.hasOwnProperty("VideoUrl") && obj.hasOwnProperty("Username")
  );
  const searchResultsUsersArr = dataSet?.filter(
    (obj) => !obj.hasOwnProperty("VideoUrl") && obj.hasOwnProperty("Username")
  );
  const showSearchResults =
    searchResultsVideosArr?.length > 0 || searchResultsUsersArr?.length > 0;


  const usersArr = firebaseData.filter(
    (obj) => obj.hasOwnProperty("Username") && !obj.hasOwnProperty("VideoUrl")
  );
  const videosArr = firebaseData.filter(
    (obj) => obj.hasOwnProperty("Username") && obj.hasOwnProperty("VideoUrl")
  );

  const handleCreatorProfile = (creatorsName) => {
    const creatorsData = usersArr.filter(
      (user) => user.Username === creatorsName
    );
    const creatorsDataVideos = videosArr.filter(
      (video) => video.Username === creatorsName
    );
    localStorage.setItem("creatorsData", JSON.stringify(creatorsData));
    localStorage.setItem(
      "creatorsDataVideos",
      JSON.stringify(creatorsDataVideos)
    );

    {location.pathname==="/creator" ? window.location.reload():history.push("/creator");}
  };

  const subscribeUser = () => {
    console.log("subscribed user.");
  };

  //upload data structure
  const uploadData = {
    user_userName: userName,
    video_title: videoTitle,
    video_description: videoDescription,
    video_gameTags: videoTag,

    video_url: videoUrl,
    thumbnail_url: thumbnailUrl,
  };

  const [uploadStatus, setUploadStatus] = useState("");

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
    <AppContext.Consumer>
      {(context) => (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Sidebar />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: context.isSidebarOpen === true ? "87.3%" : "96.6%",
            }}
          >
            <AlgoliaSearchNavbar
              autocomplete={autocomplete}
              searchInput={searchInput}
            />
            {showSearchResults && (
              <p class="text-start">
                <h2 className="video__category__title p-4">Search Results</h2>
                <div className="video-row">
                  {" "}
                  {searchResultsVideosArr &&
                    searchResultsVideosArr.map((video, index) => (
                      <div>
                        <img
                          controls
                          height="250"
                          width="400"
                          src={video.thumbnailUrl}
                        />
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
                          | {video.Username} | {video.Likes} Likes |{" "}
                          {video.Views} Views{" "}
                        </p>
                      </div>
                    ))}
                </div>

                <div className="video-row">
                  {" "}
                  {searchResultsUsersArr &&
                    searchResultsUsersArr.map((user, index) => (
                      <UserProfileCard
                        id={index}
                        profileImg={user.ProfilePictureUrl}
                        username={user.Username}
                        subscribersCount={`${user.SubscriberCount} Subscribers`}
                        onClick={() => subscribeUser(user.Username)}
                        handleUserClick={() => handleCreatorProfile(user.Username)}
                      />
                    ))}
                </div>
              </p>
            )}
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
              <h2>Please Choose a Video</h2>
              <input type="file" onChange={handleChange} accept="video/mp4" />
              <br />
              <br />

              <h2>Please Choose a Thumbnail</h2>
              <input
                type="file"
                onChange={handleThumbnail}
                accept="image/jpeg"
              />

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
          </div>
        </div>
      )}
    </AppContext.Consumer>
  );
}

export default FileUpload;
