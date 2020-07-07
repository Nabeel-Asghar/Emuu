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
import profileImage from "./pages/profileImage";
import editPhotographyPage from "./pages/editPhotographyPage";

// Components
import Navbar from "./components/Navbar";
import AuthRoute from "./util/AuthRoute";

// API
import API from "./api";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#a7c0cd",
      main: "#78909c",
      dark: "#4b636e",
      contrastText: "#fafafa",
    },
    secondary: {
      light: "#cfcfcf",
      main: "#9e9e9e",
      dark: "#707070",
      contrastText: "#fafafa",
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
              <div className="container">
                <Switch>
                  <Route exact path="/" component={home} />
                  <Route exact path="/login" component={login} />
                  <Route exact path="/signup" component={signup} />
                  <Route exact path="/profileImage" component={profileImage} />
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
                  <AuthRoute
                    exact
                    path="/photographers/:photographerID/book"
                    component={book}
                  />
                </Switch>
              </div>
            </BrowserRouter>
          </div>
        </Provider>
      </MuiThemeProvider>
    );
  }
}

export default App;
