import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useEffect, useState, useMemo } from "react";
import "../home/Home.scss";
import "./UploadButton.scss"
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
import { Link, useHistory, useLocation } from "react-router-dom";
import AlgoliaSearchNavbar from "../NavbarPostLogin/AlgoliaSearchNavbar/AlgoliaSearchNavbar";
import UserProfileCard from "../common/UserProfileCard/UserProfileCard";
import Sidebar from "../Sidebar/Sidebar";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HeaderPostLogin from "../NavbarPostLogin/HeaderPostLogin";
import AppContext from "../../AppContext";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import CloseIcon from '@mui/icons-material/Close';
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
  const [file, setFile] = useState({});

  const firebaseData = JSON.parse(localStorage.getItem("firebase-data"));

  function handleChange(e) {
    setFile(e.target.files[0])
  }


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

    {
      location.pathname === "/creator"
        ? window.location.reload()
        : history.push("/creator");
    }
  };

  const subscribeUser = () => {
    console.log("subscribed user.");
  };

  //upload data structure


  function dropHandler(e) {
    e.preventDefault();
    [...e.dataTransfer.items].forEach(i => {
      if (i.getAsFile().type == "video/mp4") {
        setFile(i.getAsFile())
      }

    })
  }
  useEffect(async () => {
    if (file.name) {
      document.querySelector("#UC1").style.display = "none";
      document.querySelector("#UC2").style.display = "flex";
    }


  }, [file])



  //  useEffect(async () => {
  //    if (videoUrl && thumbnailUrl) {
  //      await axios
  //        .post(
  //          "http://localhost:8080/auth/upload",
  //          JSON.stringify({ ...uploadData })
  //        )
  //        .then((result) => {
  //          setUploadStatus(
  //            <span style={{ color: "green" }}>
  //              <CheckCircleOutlineIcon /> Upload successful
  //            </span>
  //          );
  //        });
  //    }
  //  }, [videoUrl, thumbnailUrl]);

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
                        handleUserClick={() =>
                          handleCreatorProfile(user.Username)
                        }
                      />
                    ))}
                </div>
              </p>
            )}






            <div className="film">

              <div className="UploadCard" id="UC1">

                <div className="Container" >
                  <h3>Upload video</h3>
                  <div className="drag-area" onDragOver={e => e.preventDefault()} onDrop={e => dropHandler(e)}>
                    <div className="UploadIcon">
                      <FileUploadIcon></FileUploadIcon>
                    </div>
                    <p className="upload-line1">Drag and drop video files to upload</p>
                    <p className="upload-line2">The only supported format is mp4.</p>
                    <button className="SelectFiles" onClick={() => document.querySelector("#upload-video").click()}> SELECT FILES</button>

                    <input type="file" id="upload-video" style={{ display: "none" }} onChange={handleChange} accept="video/mp4" />

                    <p id="file-name"></p>

                  </div>

                </div>

              </div>

              <div className="UploadCard" id="UC2" style={{ display: "None" }}>
             <div className="UC2-header">   <h2>{file?.name?.split(".mp4")[0]}</h2> <CloseIcon/></div>
                <div className="UC2-main">
                  <div className="UC2-left">
                    <div className="UC2-details">
                      <h2> Details </h2></div>
                        <div className="UC2-thumbnail">
                          <h2>Thumbnail</h2></div>
                          </div>

                          <div className="UC2-right">
                            <h2>Preview</h2>

                          </div>
                        </div>
                      </div>








                    </div>

                  </div>

                </div>

              

            
          
          
      )}
        </AppContext.Consumer>
      )
      }

      export default FileUpload;



