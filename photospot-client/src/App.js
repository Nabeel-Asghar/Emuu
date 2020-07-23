import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import tokenDecoder from "jwt-decode";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";
import { logoutUser, getUserData } from "./redux/actions/userActions";

// Theme
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

// Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";
import specificPhotographer from "./pages/specificPhotographer";
import book from "./pages/book";
import profile from "./pages/profile";
import search from "./pages/search";
import editPhotographyPage from "./pages/editPhotographyPage";
import photographyPictures from "./pages/photographyPictures";
import homePage from "./pages/homePage";

// Components
import Navbar from "./components/Navbar";
import AuthRoute from "./util/AuthRoute";

// API
import API from "./api";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#7986cb",
      main: "#3f51b5",
      dark: "#303f9f",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff4081",
      main: "#f50057",
      dark: "#c51162",
      contrastText: "#fff",
    },
  },
  typography: {
    useNextVariants: true,
  },
  spreadThis: {
    form: {
      textAlign: "center",
    },
    image: {
      margin: "20px auto 20px auto",
    },

    pageTitle: {
      margin: "10px auto 10px auto",
    },

    textField: {
      margin: "7px auto 7px auto",
    },

    button: {
      marginTop: "10px",
      position: "relative",
    },
    progress: {
      position: "absolute",
    },
    customError: {
      color: "red",
      fontSize: "0.8rem",
      marginTop: "10px",
      marginBottom: "10px",
    },
    centerGrid: {
      textAlign: "center",
    },
    cardAction: {
      display: "block",
      textAlign: "initial",
    },
    gridList: {
      width: "500px",
      height: "450px",
    },

    container: {
      textAlign: "center",
    },

    text: {
      marginTop: "110px",
    },

    centered: {
      position: "absolute",
      top: "100 %",
      left: "50%",
      transform: "translate(-50%, -50%)",
    },

    profilePic: {
      height: "250px",
      width: "100%",
      objectFit: "cover",
    },

    avatar: {
      width: "200px",
      height: "200px",
      borderRadius: "50%",
      objectFit: "cover",
    },

    bookButton: {
      marginTop: "15px",
      marginBottom: "15px",
      width: "110px",
    },
    horseShit: {
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "cover",
    },
    notFullWidth: {
      margin: "15px",
    },
  },
});

const token = localStorage.FirebaseIdToken;

if (token) {
  const decodedToken = tokenDecoder(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: "SET_AUTHENTICATED" });
    API.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Provider store={store}>
          <div className="App">
            <BrowserRouter>
              <Navbar />

              <Switch>
                <Route exact path="/home" component={homePage} />
                <div className="container">
                  <Route exact path="/" component={home} />
                  <Route exact path="/login" component={login} />
                  <Route exact path="/signup" component={signup} />
                  <Route exact path="/profile" component={profile} />
                  <Route exact path="/search/:searchQuery" component={search} />

                  <Route
                    exact
                    path="/photographers/:photographerID"
                    component={specificPhotographer}
                  />
                  <Route
                    exact
                    path="/yourPhotographyProfile"
                    component={editPhotographyPage}
                  />
                  <Route
                    exact
                    path="/uploadPhotographyPictures"
                    component={photographyPictures}
                  />
                  <AuthRoute
                    exact
                    path="/photographers/:photographerID/book"
                    component={book}
                  />
                </div>
              </Switch>
            </BrowserRouter>
          </div>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
