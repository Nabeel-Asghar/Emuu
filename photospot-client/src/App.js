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
import searchPage from "./pages/searchPage";
import login from "./pages/login";
import signup from "./pages/signup";
import resetPassword from "./pages/resetPassword";
import changePassword from "./pages/changePassword";
import resetPasswordSent from "./pages/resetPasswordSent";
import changePasswordSent from "./pages/changePasswordSent";
import messaging from "./pages/messaging";
import specificPhotographer from "./pages/specificPhotographer";
import book from "./pages/book";
import profile from "./pages/profile";
import search from "./pages/Search/search";
import editPhotographyPage from "./pages/editPhotographyPage";
import photographyPictures from "./pages/photographyPictures";
import home from "./pages/home";
import setYourSchedule from "./pages/setYourSchedule";
import userDashboard from "./pages/userDashboard";
import photographerDashboard from "./pages/photographerDashboard";
import onboard from "./pages/onboard";
import successPage from "./pages/successPage";
import checkout from "./pages/checkout";
import photoVault from "./pages/photoVault";

// Components
import Navbar from "./components/shared/Navbar";
import AuthRoute from "./util/AuthRoute";

// API
import API from "./api";

// Stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
const stripePromise = loadStripe(
  "pk_test_51HEMVlLQ55OPNOhDWc6WmWpkBFB2u4jz4fIBnkc2BQ9ZufE2eGDj5LG3GUxUWDJKxh0WU964w2EafrUTXNO3E3P600sAgdBLPU"
);

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#ffffff",
      main: "#ffffff",
      dark: "#cccccc",
      contrastText: "#000000",
    },
    secondary: {
      light: "#65edbb",
      main: "#23ba8b",
      dark: "#00895e",
      contrastText: "#ffffff",
    },
    tertiary: {
      light: "#E30000",
      main: "#E30000",
      dark: "##880000",
      contrastText: "#ffffff",
    },
  },

  typography: {
    useNextVariants: true,
  },

  spreadThis: {
    auth: {
      maxWidth: "420px",
      margin: "auto",
      textAlign: "center",
    },
    bottomAuth: {
      maxWidth: "420px",
      margin: "auto",
      padding: "15px 0px",
      marginTop: 15,
      textAlign: "center",
    },
    authText: {
      padding: "20px 35px",
    },
    pageContainer: {
      paddingBottom: "15px",
    },
    cardStyle: {
      marginTop: "5px",
      padding: "20px 0px 15px 0px",
    },
    textStyle: {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      paddingBottom: "15px",
      fontWeight: "bold",
    },
    interiorCard: {
      padding: "0px 10px 0px 40px",
    },
    margin: {
      margin: "10px 0px",
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
    brand: {
      width: "60px",
      height: "60px",
      borderRadius: "50%",
      padding: "10px 0px",
    },
    authHeader: {
      paddingBottom: 20,
      fontWeight: "bold",
    },
    customError: {
      color: "red",
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

    centered: {
      position: "sticky",
      transform: "translate(4%, -40%)",
    },

    background: {
      height: "500px",
      width: "100%",
      objectFit: "cover",
      clipPath: "polygon(0 0, 0 100%, 100% 75%, 100% 0)",
      zIndex: "auto",
    },

    avatar: {
      width: "350px",
      height: "350px",
      borderRadius: "50%",
      objectFit: "cover",
      zIndex: 1,
      border: "5px solid #fff",
    },

    notFullWidth: {
      margin: "15px",
    },

    textGrid: {
      marginLeft: "50px",
    },

    rightGrid: {
      textAlign: "right",
    },

    bookButton: {
      marginRight: "20px",
      marginTop: "12px",
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
                <Route exact path="/" component={home} />

                <Route
                  exact
                  path="/photographers/:photographerID"
                  component={specificPhotographer}
                />

                <Route exact path="/login" component={login} />

                <Route exact path="/signup" component={signup} />

                <div className="container">
                  <Route exact path="/search" component={search} />

                  <Route
                    exact
                    path="/resetPassword"
                    component={resetPassword}
                  />

                  <AuthRoute exact path="/onboard" component={onboard} />

                  <AuthRoute
                    exact
                    path="/onboard/success"
                    component={successPage}
                  />

                  <AuthRoute
                    exact
                    path="/onboard/refresh"
                    component={onboard}
                  />

                  <Route
                    exact
                    path="/resetPasswordSent"
                    component={resetPasswordSent}
                  />

                  <AuthRoute
                    exact
                    path="/changePassword"
                    component={changePassword}
                  />

                  <AuthRoute
                    exact
                    path="/changePasswordSent"
                    component={changePasswordSent}
                  />

                  <AuthRoute
                    exact
                    path="/userDashboard"
                    component={userDashboard}
                  />

                  <AuthRoute
                    exact
                    path="/photographerDashboard"
                    component={photographerDashboard}
                  />

                  <AuthRoute exact path="/profile" component={profile} />

                  <AuthRoute exact path="/messaging" component={messaging} />

                  <AuthRoute
                    exact
                    path="/vault/:orderID"
                    component={photoVault}
                  />

                  <Route exact path="/search/:searchQuery" component={search} />

                  {/* <Route exact path="/search/:type/:city/:state" component={search} /> */}

                  <AuthRoute
                    exact
                    path="/yourPhotographyProfile"
                    component={editPhotographyPage}
                  />

                  <AuthRoute
                    exact
                    path="/yourPhotographyProfile/setYourSchedule"
                    component={setYourSchedule}
                  />

                  <AuthRoute
                    exact
                    path="/uploadPhotographyPictures"
                    component={photographyPictures}
                  />

                  <AuthRoute
                    exact
                    path="/photographers/:photographerID/book"
                    component={book}
                  />

                  <Elements stripe={stripePromise}>
                    <AuthRoute
                      exact
                      path="/photographers/:photographerID/book/checkout"
                      component={checkout}
                    />
                  </Elements>
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
