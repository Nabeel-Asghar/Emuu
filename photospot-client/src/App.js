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
import photographer from "./pages/photographer";

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
    content: {
      height: "calc(100vh - 100px)",
      overflow: "auto",
      padding: "25px",
      marginLeft: "300px",
      boxSizing: "border-box",
      overflowY: "scroll",
      top: "50px",
      width: "calc(100% - 300px)",
      position: "absolute",
    },

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

    chatHeader: {
      width: "calc(100% - 301px)",
      height: "50px",
      backgroundColor: "#344195",
      position: "fixed",
      marginLeft: "301px",
      fontSize: "18px",
      textAlign: "center",
      color: "white",
      paddingTop: "10px",
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
                  <Route
                    exact
                    path="/photographers/:photographerID"
                    component={photographer}
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
