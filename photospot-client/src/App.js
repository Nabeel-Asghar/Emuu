import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import tokenDecoder from "jwt-decode";

// Redux
import { Provider } from "react-redux";
import store from "./redux/store";

// Theme
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

// Pages
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

// Components
import Navbar from "./components/Navbar";
import AuthRoute from "./util/AuthRoute";

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
  },
});

const token = localStorage.FirebaseIdToken;
let authenticated;

if (token) {
  const decodedToken = tokenDecoder(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = "/login";
    authenticated = false;
    localStorage.clear();
  } else {
    authenticated = true;
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
                  <AuthRoute
                    exact
                    path="/login"
                    component={login}
                    authenticated={authenticated}
                  />
                  <AuthRoute
                    exact
                    path="/signup"
                    component={signup}
                    authenticated={authenticated}
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
