import logo from "./logo.svg";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HeaderPostLogin from "./components/NavbarPostLogin/HeaderPostLogin";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./components/UserAuthentication/newloginscreen";
import Register from "./components/UserAuthentication/newRegister";
import Home from "./components/home/Home";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Profile from "./components/UserProfile/Profile";
import Upload from "./components/upload/UploadButton";
import Video from "./components/videoPage/videoPage";
import { useState, useEffect } from "react";
import Creator from "./components/CreatorsPage/CreatorsPage";
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

function App() {
  const auth = localStorage.getItem("auth");
  const [video, setVideo] = useState("");

  //Navigation bar
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <HeaderPostLogin />

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
            <Creator />
          </Route>

          {auth === "true" && (
            <>
              <Route path="/userprofile">
                <Profile setVideo={setVideo} />
              </Route>

              <Route path="/upload">
                <Upload />
              </Route>
            </>
          )}

          <Route exact path="/">
            <Home setVideo={setVideo} />
          </Route>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
