import React, { useState } from "react";
import "./App.css";
import { getAuth } from "firebase/auth";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./components/UserAuthentication/newloginscreen";
import Register from "./components/UserAuthentication/newRegister";
import Settings from "./components/UserAuthentication/Settings";
import Home from "./components/home/Home";
import Profile from "./components/UserProfile/Profile";
import UploadVideo from "./components/upload/UploadButton";
import Video from "./components/videoPage/videoPage";
import Creator from "./components/CreatorsPage/CreatorsPage";
import AppProvider from "./AppProvider";

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
  const auth = getAuth();
  const [video, setVideo] = useState("");

  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
        <div className="App">
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

            {auth && (
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
