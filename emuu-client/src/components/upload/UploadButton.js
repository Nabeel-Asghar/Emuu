import React, { useEffect, useState, useMemo } from "react";

import "../home/Home.scss";
import "./UploadButton.scss";

import axios from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth } from "firebase/auth";
import { createAutocomplete } from "@algolia/autocomplete-core";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { Avatar } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Tooltip,
  Dialog,
  TextField,
  Box,
  InputLabel,
  Select,
  FormHelperText,
  FormControl,
  MenuItem,
} from "@mui/material";

import AlgoliaSearchNavbar from "../NavbarPostLogin/AlgoliaSearchNavbar/AlgoliaSearchNavbar";
import UserProfileCard from "../common/UserProfileCard/UserProfileCard";
import Sidebar from "../Sidebar/Sidebar";
import Video from "./videoPreview";
import "./videoPreview.scss";

import AppContext from "../../AppContext";

import { storage } from "../../Firebase.js";
import "../../Firebase.js";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";

const useStyles = makeStyles({
  btnClass: {
    background: "#085fd4 !important",
    color: "white",
    fontWeight: "bold",
    border: "none",
    padding: "10px 20px",
    marginTop: "30px !important",
  },
  submitBtn: {
    background: "#085fd4 !important",
    color: "white",
    fontWeight: "bold",
    border: "none",
    padding: "10px 20px",
    marginLeft: "auto !important",
    marginRight: "30px !important",
  },
});

const FileUpload = ({ setVideo }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen((open) => !open);
  };

  //use state for registration variables
  const history = useHistory();
  const location = useLocation();
  const [videoTitle, setVideoTitle] = useState("");
  const [videoTitleErr, setVideoTitleErr] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoDescriptionErr, setVideoDescriptionErr] = useState("");
  const [videoTag, setVideoTag] = useState("");
  const [videoTagErr, setVideoTagErr] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [autocompleteState, setAutocompleteState] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [count, setCount] = useState(0);
  const [file, setFile] = useState({});
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailErr, setThumbnailErr] = useState("");
  const [videoPreview, setVideoPreview] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const [firebaseData, setFirebaseData] = useState([]);
  async function getData() {
    const response = await axios.get(
      "http://localhost:8080/auth/firebase-data"
    );
    const users = response.data.message.Users;
    const videos = response.data.message.Videos;
    var completeFirebaseData = videos.concat(users);
    setFirebaseData(completeFirebaseData);
  }

  useEffect(async () => {
    await getData();
  }, []);

  //Gets user authentication
  const auth = getAuth();
  const user = auth.currentUser;

  //Store percent
  const [percent, setPercent] = useState(0);

  function CircularIntegration() {
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const timer = React.useRef();

    const buttonSx = {
      ...(success && {
        color: green[500],
        "&:hover": {
          color: green[700],
        },
      }),
    };

    React.useEffect(() => {
      return () => {
        clearTimeout(timer.current);
      };
    }, []);

    const handleButtonClick = (e) => {
      e.preventDefault();

      if (videoTitle.length === 0) {
        setVideoTitleErr("This is a required field");
      }

      if (videoTitle.length > 0) {
        setVideoTitleErr("");
      }

      if (videoDescription.length === 0) {
        setVideoDescriptionErr("This is a required field");
      }

      if (videoDescription.length > 0) {
        setVideoDescriptionErr("");
      }

      if (videoTag.length === 0) {
        setVideoTagErr("This is a required field");
      }

      if (videoTag.length > 0) {
        setVideoTagErr("");
      }

      if (thumbnail?.name?.length === 0) {
        setThumbnailErr("This is a required field");
      }

      if (thumbnail?.name?.length > 0) {
        setThumbnailErr("");
      }

      timer.current = window.setTimeout(() => {
        if (
          videoTitleErr.length === 0 &&
          videoDescriptionErr.length === 0 &&
          videoTagErr.length === 0 &&
          thumbnailErr.length === 0
        ) {
          handleUpload();

          if (!loading) {
            setSuccess(false);
            setLoading(true);
            timer.current = window.setTimeout(() => {
              setSuccess(true);
              setLoading(false);
            }, 2000);
          }
        }
      }, 200);
    };

    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ m: 1, position: "relative" }}>
          <Fab
            aria-label="save"
            color="primary"
            sx={buttonSx}
            onClick={handleButtonClick}
          >
            {success ? <CheckIcon /> : <SaveIcon />}
          </Fab>
          {loading && (
            <CircularProgress
              size={68}
              sx={{
                color: green[500],
                position: "absolute",
                top: -6,
                left: -6,
                zIndex: 1,
              }}
            />
          )}
        </Box>
        <Box sx={{ m: 1, position: "relative" }}>
          <Button
            variant="contained"
            sx={buttonSx}
            disabled={loading}
            onClick={handleButtonClick}
          >
            SUBMIT
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                color: green[500],
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          )}
        </Box>
      </Box>
    );
  }

  const handleTitleChange = (event) => {
    setVideoTitle(event.target.value);
    if (event.target.value.length === 0) {
      setVideoTitleErr("This is a required field");
    }
    if (event.target.value.length > 0) {
      setVideoTitleErr("");
    }
  };

  const handleDescriptionChange = (event) => {
    setVideoDescription(event.target.value);
    if (event.target.value.length === 0) {
      setVideoDescriptionErr("This is a required field");
    }
    if (event.target.value.length > 0) {
      setVideoDescriptionErr("");
    }
  };

  const handleGameTagChange = (event) => {
    setVideoTag(event.target.value);
    if (event.target.value.length === 0) {
      setVideoTagErr("This is a required field");
    }
    if (event.target.value.length > 0) {
      setVideoTagErr("");
    }
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setUserName(user.displayName);

    const reader = new FileReader();

    const selectedFile = e.target.files[0];
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }

    reader.onload = (readerEvent) => {
      if (selectedFile.type.includes("video")) {
        setVideoPreview(readerEvent.target.result);
      }
    };
  };

  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
    if (thumbnail?.name?.length === 0) {
      setThumbnailErr("This is a required field");
    }
    if (thumbnail?.name?.length > 0) {
      setThumbnailErr("");
    }
    // Reading New File (open file Picker Box)
    const reader = new FileReader();
    // Gettting Selected File (user can select multiple but we are choosing only one)
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      reader.readAsDataURL(selectedFile);
    }
    // As the File loaded then set the stage as per the file type
    reader.onload = (readerEvent) => {
      if (selectedFile.type.includes("image")) {
        setThumbnailPreview(readerEvent.target.result);
      }
    };
  };

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

  const subscribeUser = () => {};

  //upload data structure
  const uploadData = {
    user_userName: userName,
    video_title: videoTitle,
    video_description: videoDescription,
    video_gameTags: videoTag,

    video_url: videoUrl,
    thumbnail_url: thumbnailUrl,
  };

  function dropHandler(e) {
    e.preventDefault();
    [...e.dataTransfer.items].forEach((i) => {
      if (i.getAsFile().type == "video/mp4") {
        setFile(i.getAsFile());
      }
    });
  }
  useEffect(async () => {
    if (file.name) {
      document.querySelector("#UC1").style.display = "none";
      document.querySelector("#UC2").style.display = "flex";
    }
  }, [file]);

  //If a user doesn't choose a file and tries to upload, error will appear
  const handleUpload = async (e) => {
    if (!file) {
      alert("Please upload a video first!");
    }

    //Restrict file size to 40 MB ~ equivalent to 30 second video

    if (file.size > 40 * 1024 * 1024) {
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
        });
      }
    );
  };

  function dropHandler(e) {
    e.preventDefault();
    [...e.dataTransfer.items].forEach((i) => {
      if (i.getAsFile().type == "video/mp4") {
        setFile(i.getAsFile());
      }
    });
  }
  useEffect(() => {
    if (file && document?.querySelector("#file-name"))
      document.querySelector("#file-name").innerHTML = "jdwu";
  }, [file]);

  useEffect(async () => {
    if (videoUrl && thumbnailUrl) {
      await axios
        .post(
          "https://emuu-cz5iycld7a-ue.a.run.app/auth/upload",
          JSON.stringify({ ...uploadData })
        )
        .then((result) => {
          setUploadStatus(
            <span style={{ color: "green" }}>
              <CheckCircleOutlineIcon /> Upload successful
            </span>
          );
        });
      history.push("/userprofile");
    }
  }, [videoUrl, thumbnailUrl]);

  return (
    <AppContext.Consumer>
      {(context) => (
        <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
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
                        <Card sx={{ width: 385, height: 375 }}>
                          <CardMedia
                            component="img"
                            image={video.ThumbnailUrl}
                          />
                          <CardContent>
                            <CardHeader
                              avatar={
                                <Avatar
                                  sx={{ width: 60, height: 60 }}
                                  src={video.ProfilePic}
                                ></Avatar>
                              }
                              title={
                                <Typography
                                  variant="body2"
                                  color="text.primary"
                                  fontWeight="bold"
                                  fontSize="20px"
                                >
                                  <Link to="/video">
                                    <span
                                      onClick={() => {
                                        setVideo(video);
                                      }}
                                    >
                                      {video.Title}
                                    </span>
                                  </Link>
                                </Typography>
                              }
                            />

                            <div className="videoInfo">
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight="medium"
                                fontSize="18px"
                              >
                                {video.Likes} Likes &#x2022; {video.Views} Views
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                fontWeight="medium"
                                fontSize="18px"
                              >
                                {video.Username}
                              </Typography>
                            </div>
                          </CardContent>
                        </Card>
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

            <button
              className="SelectFiles"
              onClick={() => setOpen(true)}
              style={{
                width: "200px",
                marginLeft: "auto",
                marginRight: "auto",
                marginTop: "300px",
              }}
            >
              UPLOAD VIDEO
            </button>
            <Dialog open={open} sx={{}} onClose={handleClose}>
              <div
                className="UploadCard"
                id="UC1"
                style={{
                  top: "0px",
                }}
              >
                <div className="Container">
                  <h3>Upload Video</h3>
                  <div
                    className="drag-area"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => dropHandler(e)}
                  >
                    <div className="UploadIcon">
                      <FileUploadIcon></FileUploadIcon>
                    </div>
                    <p className="upload-line1">
                      Drag and drop video files to upload
                    </p>
                    <p className="upload-line2">
                      The only supported format is .mp4 files
                    </p>
                    <button
                      className="SelectFiles"
                      onClick={() =>
                        document.querySelector("#upload-video").click()
                      }
                    >
                      SELECT FILES
                    </button>

                    <input
                      type="file"
                      id="upload-video"
                      style={{ display: "none" }}
                      onChange={handleChange}
                      accept="video/mp4"
                    />

                    <p id="file-name"></p>
                  </div>
                </div>
              </div>

              <div
                className="UploadCard"
                id="UC2"
                style={{ display: "None", top: "0px", height: "700px" }}
              >
                <div
                  className="UC2-header"
                  style={{
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h5"
                    style={{
                      color: "#FFFFFF",
                      fontSize: "24px",
                      marginLeft: "20px",
                      marginTop: "10px",
                      marginBottom: "10px",
                    }}
                  >
                    {file?.name?.split(".mp4")[0]}
                  </Typography>
                  <hr />
                  <Tooltip title="Save and close">
                    <Button onClick={() => setOpen(false)}>
                      <CloseIcon />
                    </Button>
                  </Tooltip>
                </div>
                <div
                  style={{
                    marginLeft: "50px",
                    display: "flex",
                    flexDirection: "row",
                    height: "calc(100% - 180px)",
                    width: "calc(100% - 50px)",
                    marginTop: "100px",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <h2 variant="h2" component="h2">
                      Details
                    </h2>
                    <Box
                      component="form"
                      sx={{
                        "& .MuiTextField-root": {
                          mt: 2,
                          width: "50ch",
                        },
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        error={videoTitleErr.length > 0}
                        id={
                          videoTitleErr.length === 0
                            ? "outlined-multiline-static"
                            : "outlined-error-helper-text"
                        }
                        label={
                          videoTitleErr.length === 0
                            ? "Title *"
                            : "A video title is required!"
                        }
                        placeholder="Add a title that describes your video"
                        multiline
                        rows={2}
                        value={videoTitle}
                        onChange={handleTitleChange}
                        helperText={videoTitleErr.length === 0 && videoTitleErr}
                      />
                      <FormHelperText>Required</FormHelperText>
                      <TextField
                        error={videoDescriptionErr.length > 0}
                        id={
                          videoDescriptionErr.length === 0
                            ? "outlined-multiline-static"
                            : "outlined-error-helper-text"
                        }
                        label={
                          videoDescriptionErr.length === 0
                            ? "Description *"
                            : "A description is required!"
                        }
                        placeholder="Tell viewers about your video"
                        multiline
                        rows={4}
                        value={videoDescription}
                        onChange={handleDescriptionChange}
                        sx={{ marginTop: "30px !important" }}
                        helperText={
                          videoDescriptionErr.length === 0 &&
                          videoDescriptionErr
                        }
                      />
                      <FormHelperText>Required</FormHelperText>
                      <FormControl
                        required
                        sx={{ display: "flex", mt: 4, width: 200 }}
                        error={videoTagErr.length > 0}
                      >
                        <InputLabel
                          id={
                            videoTagErr.length === 0
                              ? "demo-simple-select-required-label"
                              : "demo-simple-select-error-label"
                          }
                        >
                          Game Tag
                        </InputLabel>
                        <Select
                          labelId={
                            videoTagErr.length === 0
                              ? "demo-simple-select-required-label"
                              : "demo-simple-select-error-label"
                          }
                          id={
                            videoTagErr.length === 0
                              ? "demo-simple-select-required"
                              : "demo-simple-select-error"
                          }
                          value={videoTag}
                          label="Game Tag *"
                          onChange={handleGameTagChange}
                        >
                          <MenuItem value="Action">Action</MenuItem>
                          <MenuItem value="Adventure">Adventure</MenuItem>
                          <MenuItem value="Fighting">Fighting</MenuItem>
                          <MenuItem value="First Person Shooting">
                            First Person Shooter
                          </MenuItem>
                          <MenuItem value="Platformer">Platformer</MenuItem>
                          <MenuItem value="Racing">Racing</MenuItem>
                          <MenuItem value="RPG">RPG</MenuItem>
                          <MenuItem value="Sports">Sports</MenuItem>
                          <MenuItem value="Strategy">Strategy</MenuItem>
                          <MenuItem value="Survival">Survival</MenuItem>
                          <MenuItem value="Other">Other</MenuItem>
                        </Select>
                        <FormHelperText>Required</FormHelperText>
                      </FormControl>

                      <FormControl
                        required
                        sx={{ display: "flex", mt: 0, width: 200 }}
                        error={thumbnailErr.length > 0}
                      >
                        <label htmlFor="upload-photo">
                          <input
                            style={{ display: "none" }}
                            id="upload-thumbnail"
                            name="upload-thumbnail"
                            type="file"
                            onChange={handleThumbnailChange}
                            accept="image/jpeg"
                          />

                          <Button
                            className={classes.btnClass}
                            type="submit"
                            variant="contained"
                            component="span"
                            onClick={() =>
                              document
                                .querySelector("#upload-thumbnail")
                                .click()
                            }
                          >
                            UPLOAD THUMBNAIL
                          </Button>

                          {thumbnail && (
                            <img
                              src={thumbnailPreview}
                              alt="thumbnail-alt"
                              height="80"
                              style={{ marginLeft: "5px" }}
                            />
                          )}
                        </label>
                        <FormHelperText>Required</FormHelperText>
                      </FormControl>
                    </Box>
                  </div>
                  <div style={{ marginLeft: "30px", marginTop: "55px" }}>
                    <Video
                      id="1"
                      height="200"
                      src={videoPreview}
                      title={file?.name?.split(".mp4")[0]}
                    />
                  </div>
                </div>
                <CircularIntegration
                  className={classes.submitBtn}
                  type="submit"
                  variant="contained"
                  component="span"
                />
                {/*
                <Button
                  className={classes.submitBtn}
                  type="submit"
                  variant="contained"
                  component="span"
                  onClick={onFormSubmit}
                >
                  SUBMIT
                </Button>
                */}
              </div>
            </Dialog>
          </div>
        </div>
      )}
    </AppContext.Consumer>
  );
};

export default FileUpload;
