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
import messaging from "./pages/messaging";

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
    userSent: {
      float: "left",
      clear: "both",
      padding: "20px",
      boxSizing: "border-box",
      wordWrap: "break-word",
      marginTop: "10px",
      backgroundColor: "#707BC4",
      color: "white",
      width: "300px",
      borderRadius: "10px",
    },

    friendSent: {
      float: "right",
      clear: "both",
      padding: "20px",
      boxSizing: "border-box",
      wordWrap: "break-word",
      marginTop: "10px",
      backgroundColor: "#FF0000",
      color: "white",
      width: "300px",
      borderRadius: "10px",
    },

    //Left Grid
    UserList: {
      marginTop: "13px",
      backgroundColor: "#fffffff",
      height: "calc(100% - 35px)",
      boxShadow: "0px 0px 3px black",
    },

    //Right grid
    ChatList: {
      boxSizing: "border-box",
      overflowY: "auto",
    },

    //Messages
    chatViewContainer: {
      height: "calc(100vh - 200px)",
      overflow: "auto",
    },

    //Send Message
    chatTextBoxContainer: {
      position: "absolute",
      bottom: "15px",
      left: "315px",
      boxSizing: "border-box",
      overflow: "auto",
      width: "calc(100% - 300px - 50px)",
    },

    unreadMessage: {
      color: "red",
      position: "absolute",
      top: "0",
      right: "5px",
    },

    chatTextBox: {
      width: "calc(100% - 25px)",
    },

    sendBtn: {
      color: "blue",
      cursor: "pointer",
      "&:hover": {
        color: "gray",
      },
    },

    listItem: {
      cursor: "pointer",
    },
    newChatBtn: {
      borderRadius: "0px",
    },
    unreadMessage: {
      color: "red",
      position: "absolute",
      top: "0",
      right: "5px",
    },

    chatHeader: {
      position: "sticky",
      height: "50px",
      backgroundColor: "#344195",
      fontSize: "18px",
      textAlign: "center",
      paddingTop: "10px",
      color: "white",
      boxSizing: "border-box",
    },
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
                  <AuthRoute exact path="/login" component={login} />
                  <AuthRoute exact path="/signup" component={signup} />
                  <Route exact path="/messaging" component={messaging} />
                  <Route
                    exact
                    path="/signup/profileImage"
                    component={profileImage}
                  />
                  <Route
                    exact
                    path="/photographers/:photographerID"
                    component={specificPhotographer}
                  />
                  <Route
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
