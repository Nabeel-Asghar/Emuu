import React, { useState, useEffect, useCallback, useMemo } from "react";
import AddIcon from "@mui/icons-material/Add";
import "./Profile.scss";
import "../../Firebase.js";
import Feeds from "./Feeds";
import UserInfo from "./UserInfo";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { Blob } from "firebase/firestore";
import { db, storage } from "../../Firebase.js";
import { uid } from "uid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import { Avatar } from "@mui/material";
import {
  getDoc,
  getDocs,
  setDoc,
  doc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import ReactDOM from "react-dom";
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { getOrientation } from "get-orientation/browser";
import ImgDialog from "./imgDialog";
import { getCroppedImg, getRotatedImage } from "./canvasUtils";
import { styles } from "./styles";
import { createAutocomplete } from "@algolia/autocomplete-core";
import AlgoliaSearchNavbar from "../NavbarPostLogin/AlgoliaSearchNavbar/AlgoliaSearchNavbar";
import UserProfileCard from "../common/UserProfileCard/UserProfileCard";
import axios from "axios";
import { uploadString } from "@firebase/storage";
import { Link, useHistory, useLocation } from "react-router-dom";
const ORIENTATION_TO_ANGLE = {
  3: 180,
  6: 90,
  8: -90,
};

function Profile({ setVideo, video }, { classes }) {
  const [percent, setPercent] = useState(0);
  const displayName = localStorage.getItem("displayName");
  const docRef = doc(db, "Users", displayName);
  const [imageSrc, setImageSrc] = React.useState(null);
  const [croppedImageSrc, setCroppedImageSrc] = React.useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const history = useHistory();
  const [Banner, setBanner] = useState("");
  const [ProfilePic, setProfilePic] = useState("");
  const [subscriberCount, setSubscriberCount] = useState("");
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
async function getUser() {
    const dis = {
      displayName: displayName,
    };
    await axios
      .post("http://localhost:8080/auth/creator", JSON.stringify({ ...dis }))
      .then(function (response) {});

    const response = await axios.get("http://localhost:8080/auth/creator");

    const user = response.data.message.UserDetails;

    setBanner(user[0].BannerUrl);
    setProfilePic(user[0].ProfilePictureUrl);
    setSubscriberCount(user[0].SubscriberCount);
  }

  useEffect(async () => {
    await getUser();
  }, []);
  const dataSet = autocompleteState?.collections?.[0]?.items;
  const searchResultsVideosArr = dataSet?.filter(
    (obj) => obj.hasOwnProperty("VideoUrl") && obj.hasOwnProperty("Username")
  );
  const searchResultsUsersArr = dataSet?.filter(
    (obj) => !obj.hasOwnProperty("VideoUrl") && obj.hasOwnProperty("Username")
  );
  const showSearchResults =
    searchResultsVideosArr?.length > 0 || searchResultsUsersArr?.length > 0;

  const userName = localStorage.getItem("displayName");

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
      history.push("/creator");
    }
  };

  const subscribeUser = () => {};
  const subscribersCount = localStorage.getItem("subscribersCount");

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      setCroppedImageSrc(croppedImage);

      uploadBackground(croppedImage);
      setTimeout(() => window.location.reload(), 1500);
      return false;
    } catch (e) {
      console.error(e);
    }
  }, [imageSrc, croppedAreaPixels, rotation]);

  const onClose = useCallback(() => {
    setCroppedImage(null);
  }, []);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);

      setImageSrc(imageDataUrl);
    }
  };
  function verifyJpeg(filename) {
    const fnArr = filename.split(".");
    if (fnArr[fnArr.length - 1] == "jpeg" || fnArr[fnArr.length - 1] == "jpg")
      return true;
    return false;
  }

  function uploadBackground(croppedImage) {
    const storage = getStorage();
    const storageRef = ref(storage, "/images/" + uid());

    // 'file' comes from the Blob or File API
    uploadString(storageRef, croppedImage, "data_url").then((snapshot) => {
      getDownloadURL(storageRef).then((URL) =>
        setDoc(
          docRef,
          {
            BannerUrl: URL,
          },
          {
            merge: true,
          }
        )
      );
    });
  }

  function uploadProfile(e) {
    let file = e.target.files[0];
    if (!verifyJpeg(file.name)) return;
    const storage = getStorage();
    const storageRef = ref(storage, "/images/" + file.name);

    uploadBytes(storageRef, file).then((snapshot) => {
      getDownloadURL(storageRef).then((URL) =>
        setDoc(
          docRef,
          {
            ProfilePictureUrl: URL,
          },
          {
            merge: true,
          }
        )
      );
    });
    setTimeout(() => window.location.reload(), 1500);
    return false;
  }



  return (
    <>
      <AlgoliaSearchNavbar
        autocomplete={autocomplete}
        searchInput={searchInput}
      />
      <div className="MainProfileDiv">
        {showSearchResults && (
          <p class="text-start">
            <h2 className="video__category__title p-4">Search Results</h2>
            <div className="video-row">
              {searchResultsVideosArr &&
                searchResultsVideosArr.map((video, index) => (
                  <div>
                    <Card sx={{ width: 385, height: 375 }}>
                      <CardMedia component="img" image={video.thumbnailUrl} />
                      <CardContent>
                        <CardHeader
                          avatar={
                            <Avatar sx={{ width: 60, height: 60 }}></Avatar>
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
                                  {video.VideoTitle}
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
              {searchResultsUsersArr &&
                searchResultsUsersArr.map((user, index) => (
                  <UserProfileCard
                    id={index}
                    profileImg={user.ProfilePictureUrl}
                    username={user.Username}
                    subscribersCount={`${user.SubscriberCount} Subscribers`}
                    onClick={() => {
                      subscribeUser(user.Username);
                    }}
                    handleUserClick={() => handleCreatorProfile(user.Username)}
                  />
                ))}
            </div>
          </p>
        )}
        <div className="profile-container">
          <div className="top-portion">
            <div className="user-profile-bg-image">
              <div>
                {imageSrc ? (
                  <React.Fragment>
                    <div className={"reactEasyCrop_Container"}>
                      <Cropper
                        image={imageSrc}
                        crop={crop}
                        rotation={rotation}
                        zoom={zoom}
                        aspect={6 / 1}
                        onCropChange={setCrop}
                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                      />
                    </div>
                    <div className={"submit_Container"}>
                      <div className={styles.sliderContainer}>
                        <Typography
                          variant="overline"
                          classes={{ root: styles.sliderLabel }}
                        >
                          Zoom
                        </Typography>
                        <Slider
                          value={zoom}
                          min={1}
                          max={3}
                          step={0.01}
                          aria-labelledby="Zoom"
                          classes={{ root: styles.slider }}
                          onChange={(e, zoom) => setZoom(zoom)}
                        />
                      </div>

                      <Button
                        onClick={showCroppedImage}
                        variant="contained"
                        color="primary"
                        classes={{ root: styles.cropButton }}
                      >
                        Set Banner
                      </Button>
                    </div>
                    <ImgDialog img={croppedImage} onClose={onClose} />
                  </React.Fragment>
                ) : (
                  <div className="user-profile-bg-image">
                    <img id="prf-bg-img" src={Banner} alt="" srcSet="" />
                    <input
                      style={{ display: "none" }}
                      id="background-inp"
                      type="file"
                      onChange={(e) => onFileChange(e)}
                      accept="image/jpeg"
                    />
                    <button
                      id="background-change"
                      onClick={() =>
                        document.querySelector("#background-inp").click()
                      }
                    >
                      {" "}
                      <AddIcon />
                    </button>
                  </div>
                )}
              </div>{" "}
            </div>
          </div>

          <div className="middle-portion">
            <div className="user-profile-img">
              <img id="prf-img" src={ProfilePic} alt="" srcSet="" />
              <input
                style={{ display: "none" }}
                id="profile-inp"
                type="file"
                onChange={async (e) => {
                  uploadProfile(e);
                  setTimeout(() => window.location.reload(), 1500);
                  return false;
                }}
                accept="image/jpeg"
              />
              <button
                id="profile-change"
                onClick={() => document.querySelector("#profile-inp").click()}
              >
                {" "}
                <AddIcon />
              </button>
              <div className={"userName"}> {displayName} </div>
              <div className={"subscribers-profile"}>
                {" "}
                {subscriberCount} subscribers{" "}
              </div>
            </div>
          </div>
          <div className="bottom-portion">
            <div className="right-side"></div>

            <div className="left-side"></div>

            <Feeds setVideo={setVideo} />
          </div>
        </div>
      </div>
    </>
  );
}
function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

const StyledDemo = withStyles(styles)(Profile);

const rootElement = document.getElementById("root");
ReactDOM.render(<StyledDemo />, rootElement);
export default Profile;
