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
import Results from "./Results.js"
import {useState} from "react";

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
  const [search , setSearch] = useState("");
  //Navigation bar
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <BrowserRouter>
          <HeaderPostLogin search={search} setSearch={setSearch} />
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/search">
          <Results search = {search} />
          </Route>

           {auth === "true" && (
           <>
           <Route path="/userprofile">
           <Profile />
           </Route>

           <Route path="/upload">
           <Upload />
           </Route>

           </>
           )}
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;