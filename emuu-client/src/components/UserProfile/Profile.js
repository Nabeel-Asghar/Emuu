import "./Profile.scss";
import Feeds from "./Feeds";
import UserInfo from "./UserInfo";
import React, { useState , useEffect } from "react";
import "../../Firebase.js";
import {storage, db} from "../../Firebase.js";
import { ref,getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import AddIcon from '@mui/icons-material/Add';
import { collection, getDocs } from "firebase/firestore";

function Profile() {


  // Store uploaded file
  //const [file, setFile] = useState("");


  //File upload
  //function handleChange(event) {
  //  setFile(event.target.files[0]);
  //}
  //If a user doesn't choose a file and tries to upload, error will appear
  //const handleUpload = () => {
//   if (!file) {
//      alert("Please upload an image first");
//    }
//
//    //Store into video folder in firebase storage
//    const storageRef = ref(storage, `/images/${file.name}`);
//
//    //Upload to firebase function
//    const uploadTask = uploadBytesResumable(storageRef, file);
//
//    uploadTask.on(
//      "state_changed",
//      (snapshot) => {},
//      (err) => console.log(err),
//      () => {
//        // download url
//        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
//          console.log(url);
//        });
//      }
//    );
//  };
    useEffect(()=>{console.log(JSON.parse(localStorage.getItem("user")));getDocs(collection(db, "Users")).then(data =>{
    console.log(data)
    })}, [])


function verifyJpeg(filename){
const fnArr = filename.split(".");
if(fnArr[fnArr.length-1]== "jpeg"||fnArr[fnArr.length-1]== "jpg" )return true;
return false;
}


  function uploadBackground(e){
  let file = e.target.files[0];

  if(!verifyJpeg(file.name))return;
      const storage = getStorage();
      const storageRef = ref(storage, '/images/'+file.name);

      // 'file' comes from the Blob or File API
      uploadBytes(storageRef, file).then((snapshot) => {
   getDownloadURL(storageRef).then(URL => console.log(URL))
      });




  }


  function uploadProfile(e){
  let file = e.target.files[0];
  if( !verifyJpeg(file.name)) return;
    const storage=getStorage();
    const storageRef=ref(storage, '/images/'+file.name);

    uploadBytes(storageRef, file).then((snapshot) => {
    getDownloadURL(storageRef).then(URL =>console.log(URL))
    });

}

  return (
    <div className="MainProfileDiv">
      <div className="profile-container">
        <div className="top-portion">
          <div className="user-profile-bg-image">
            <img
              id="prf-bg-img"
              src="https://wallpaperaccess.com/full/170249.jpg"
              alt=""
              srcSet=""
            />
            <input style={{display:"none"}} id="background-inp" type="file" onChange={(e)=> uploadBackground(e)} accept="image/jpeg"/>
          <button id="background-change" onClick= {()=> document.querySelector("#background-inp").click()}>  <AddIcon /></button>
          </div>
          <div className="user-profile-img">
            <img
              id="prf-img"
              src="https://wallpaperaccess.com/full/170249.jpg"
              alt=""
              srcSet=""
            />
            <input style={{display: "none"}} id="profile-inp" type="file" onChange={(e)=>uploadProfile(e)} accept="image/jpeg"/>
               <button id="profile-change" onClick= {()=> document.querySelector("#profile-inp").click()}>  <AddIcon /></button>
            <div className={"userName"}>Moe</div>
          </div>
        </div>
        <div className="bottom-portion">
          <div className="right-side"></div>
          <UserInfo />

          <div className="left-side"></div>
          <Feeds />
        </div>
      </div>
    </div>
  );
}

export default Profile;
