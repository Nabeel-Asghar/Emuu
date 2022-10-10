import "./Profile.scss";
import Feeds from "./Feeds";
import UserInfo from "./UserInfo";
import React, { useState } from "react";
import "../../Firebase.js";
import storage from "../../Firebase.js";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function Profile() {


  // Store uploaded file
  const [file, setFile] = useState("");


  //File upload
  function handleChange(event) {
    setFile(event.target.files[0]);
  }
  //If a user doesn't choose a file and tries to upload, error will appear
  const handleUpload = () => {
    if (!file) {
      alert("Please upload an image first");
    }

    //Store into video folder in firebase storage
    const storageRef = ref(storage, `/images/${file.name}`);

    //Upload to firebase function
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (err) => console.log(err),
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
        });
      }
    );
  };
  return (
    <div className="MainProfileDiv">
      <div className="profile-container">
        <div className="top-portion">
          <div className="user-profile-bg-image">
            <img
              id="prf-bg-img"
              src="http://mcentre.lk/frontend/assets/images/default-banner.png"
              alt=""
              srcSet=""
            />
          </div>
          <div className="user-profile-img">
            <img
              id="prf-img"
              src="https://i.stack.imgur.com/l60Hf.png"
              alt=""
              srcSet=""
            />

            <div className={"userName"}>Moe</div>
          </div>
        </div>
        <div className="bottom-portion">
          <div className="right-side"></div>
          <UserInfo />
           <input type="file" onChange={handleChange} accept="image/jpeg" />

                                                 <button onClick={() => handleUpload()}
                                                 type="submit"
                                                 className="btn btn-primary">
                                                  Change Profile Picture

                                                  </button>
                                                  <input type="file" onChange={handleChange} accept="image/jpeg" />

                                                                                                   <button onClick={() => handleUpload()}
                                                                                                   type="submit"
                                                                                                   className="btn btn-primary">
                                                                                                    Change Banner Image

                                                                                                    </button>
          <div className="left-side"></div>
          <Feeds />
        </div>
      </div>
    </div>
  );
}

export default Profile;
