import React, { useState, useEffect, useCallback } from "react";
import AddIcon from "@mui/icons-material/Add";
import "./Profile.scss";
import "../../Firebase.js";
import Feeds from "./Feeds";
import UserInfo from "./UserInfo";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../Firebase.js";
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
import ReactDOM from 'react-dom'
import Cropper from 'react-easy-crop'
import Slider from '@material-ui/core/Slider'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { getOrientation } from 'get-orientation/browser'
import ImgDialog from './imgDialog'
import { getCroppedImg, getRotatedImage } from './canvasUtils'
import { styles } from './styles'
import HeaderPostLogin from "../NavbarPostLogin/HeaderPostLogin.js";

const ORIENTATION_TO_ANGLE = {
  '3': 180,
  '6': 90,
  '8': -90,
}



function Profile({ setVideo, video }, { classes }){
  const [percent, setPercent] = useState(0);
  const displayName = localStorage.getItem("displayName");
  const docRef = doc(db, "Users", displayName);
  const [imageSrc, setImageSrc] = React.useState(null)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const showCroppedImage = useCallback(async () => {
      try {
        const croppedImage = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
          rotation
        )
        console.log('donee', { croppedImage })
        setCroppedImage(croppedImage)
      } catch (e) {
        console.error(e)
      }
    }, [imageSrc, croppedAreaPixels, rotation])

    const onClose = useCallback(() => {
      setCroppedImage(null)
    }, [])

    const onFileChange = async (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]
        let imageDataUrl = await readFile(file)

        // apply rotation if needed
        const orientation = await getOrientation(file)
        const rotation = ORIENTATION_TO_ANGLE[orientation]
        if (rotation) {
          imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
        }

        setImageSrc(imageDataUrl)
      }
    }

  function verifyJpeg(filename) {
    const fnArr = filename.split(".");
    if (fnArr[fnArr.length - 1] == "jpeg" || fnArr[fnArr.length - 1] == "jpg")
      return true;
    return false;
  }

  function uploadBackground(e) {
    let file = e.target.files[0];

    if (!verifyJpeg(file.name)) return;
    const storage = getStorage();
    const storageRef = ref(storage, "/images/" + file.name);

    // 'file' comes from the Blob or File API
    uploadBytes(storageRef, file).then((snapshot) => {
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
 <div>
      {imageSrc ? (
        <React.Fragment>
          <div className={styles.cropContainer}>
            <Cropper
              image={imageSrc}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
          <div className={styles.controls}>
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
                step={0.1}
                aria-labelledby="Zoom"
                classes={{ root: styles.slider }}
                onChange={(e, zoom) => setZoom(zoom)}
              />
            </div>
            <div className={styles.sliderContainer}>
              <Typography
                variant="overline"
                classes={{ root: styles.sliderLabel }}
              >
                Rotation
              </Typography>
              <Slider
                value={rotation}
                min={0}
                max={360}
                step={1}
                aria-labelledby="Rotation"
                classes={{ root: styles.slider }}
                onChange={(e, rotation) => setRotation(rotation)}
              />
            </div>
            <Button
              onClick={uploadBackground}
              variant="contained"
              color="primary"
              classes={{ root: styles.cropButton }}
            >
              Show Result
            </Button>
          </div>
          <ImgDialog img={croppedImage} onClose={onClose} />
        </React.Fragment>
      ) : (
        <div className="top-portion">
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
      </div>

      )}
    </div>




















{/*           <div className="top-portion"> */}
{/*             <div className="user-profile-bg-image"> */}
{/*               <img id="prf-bg-img" src={Banner} alt="" srcSet="" /> */}
{/*               <input */}
{/*                 style={{ display: "none" }} */}
{/*                 id="background-inp" */}
{/*                 type="file" */}
{/*                 onChange={(e) => uploadBackground(e)} */}
{/*                 accept="image/jpeg" */}
{/*               /> */}
{/*               <button */}
{/*                id="background-change" */}
{/*                 onClick={() => */}
{/*                   document.querySelector("#background-inp").click() */}
{/*                 } */}
{/*               > */}
{/*                 {" "} */}
{/*                 <AddIcon /> */}
{/*               </button> */}
{/*             </div> */}
{/*           </div> */}
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
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}

const StyledDemo = withStyles(styles)(Profile)

const rootElement = document.getElementById('root')
ReactDOM.render(<StyledDemo />, rootElement)
export default Profile;
