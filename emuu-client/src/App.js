import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./components/UserAuthentication/newloginscreen";
import Register from "./components/UserAuthentication/newRegister";
import Settings from "./components/UserAuthentication/Settings";
import Home from "./components/home/Home";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Profile from "./components/UserProfile/Profile";
import UploadVideo from "./components/upload/UploadButton";
import Video from "./components/videoPage/videoPage";
import Creator from "./components/CreatorsPage/CreatorsPage";
import AppProvider from "./AppProvider";
import { db } from "./Firebase.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  query,
  where,
} from "firebase/firestore";

const theme = createTheme({
  palette: {
    mode: "dark",
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

function App() {
  const auth = localStorage.getItem("auth");
  const [video, setVideo] = useState("");
  const [videos, setVideos] = useState([]);
  const [users, setUsers] = useState([]);
  const completeFirebaseData = videos.concat(users);

  async function getVideos() {
    //Get all videos data
    const querySnapshotVideos = await getDocs(collection(db, "Videos"));
    const videosArr = [];
    querySnapshotVideos.forEach((doc) => {
      videosArr.push(doc.data());
    });
    setVideos(videosArr);

    //Get all users data
    const querySnapshotUsers = await getDocs(collection(db, "Users"));
    const usersArr = [];
    querySnapshotUsers.forEach((doc) => {
      usersArr.push(doc.data());
    });
    setUsers(usersArr);
  }

  useEffect(() => {
    (async () => {
      await getVideos();
    })();
  }, []);

  if (completeFirebaseData) {
    localStorage.setItem("firebase-data", JSON.stringify(completeFirebaseData));
  }

  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <div className="App">
          {/* <Sidebar /> */}
          <BrowserRouter>
            <Route exact path="/">
              <Home setVideo={setVideo} />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/video">
              <Video setVideo={setVideo} video={video} />
            </Route>
            <Route path="/creator">
              <Creator setVideo={setVideo} video={video} />
            </Route>

            {auth === "true" && (
              <>
                <Route path="/userprofile">
                  <Profile setVideo={setVideo} video={video} />
                </Route>

                <Route path="/upload">
                  <UploadVideo />
                </Route>
                <Route path="/settings">
                                  <Settings />
                                </Route>
              </>
            )}
          </BrowserRouter>
        </div>
      </ThemeProvider>
    </AppProvider>
  );
}

export default App;
