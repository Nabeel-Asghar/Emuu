import React, { useState, useEffect, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import "./Profile.scss";
import "../../Firebase.js";
import Feeds from "./Feeds";
import UserInfo from "./UserInfo";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { Blob } from "firebase/firestore";
import { db, storage } from "../../Firebase.js";
import { uid } from "uid";
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
import HeaderPostLogin from "../NavbarPostLogin/HeaderPostLogin.js";
import { uploadString } from "@firebase/storage";
import { useHistory } from "react-router-dom";
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
      console.log("donee", { croppedImage });
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
    // let file = e.target.files[0];
    //  if (!verifyJpeg(file.name)) return;
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

  const [Banner, setBanner] = useState("");
  const [ProfilePic, setProfilePic] = useState("");
  const [subscriberCount, setSubscriberCount] = useState("");
  getDoc(docRef).then((docSnap) => {
    setBanner(docSnap.data().BannerUrl);
    setProfilePic(docSnap.data().ProfilePictureUrl);
    setSubscriberCount(docSnap.data().SubscriberCount);
  });

  return (
    <>
      <HeaderPostLogin />
      <div className="MainProfileDiv">
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
