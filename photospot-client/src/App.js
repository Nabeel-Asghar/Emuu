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
import useMediaQuery from "@material-ui/core/useMediaQuery";

// Pages
import login from "./pages/login";
import signup from "./pages/SignUp/signup";
import resetPassword from "./pages/resetPassword";
import changePassword from "./pages/changePassword";
import resetPasswordSent from "./pages/resetPasswordSent";
import changePasswordSent from "./pages/changePasswordSent";
import messaging from "./pages/Messaging/messaging";
import specificPhotographer from "./pages/specificPhotographer";
import Book from "./pages/book";
import profile from "./pages/profile";
import Search from "./pages/Search/search";
import editPhotographyPage from "./pages/UserPhotographerPage/editPhotographyPage";
import photographyPictures from "./pages/photographyPictures";
import Home from "./pages/home";
import setYourSchedule from "./pages/setYourSchedule";
import userDashboard from "./pages/userDashboard";
import photographerDashboard from "./pages/photographerDashboard";
import onboard from "./pages/onboardStripe/onboard";
import refresh from "./pages/onboardStripe/refresh";
import successPage from "./pages/successPage";
import checkout from "./pages/checkout";
import photoVault from "./pages/photoVault";
import photographerPageSetup from "./pages/SignUp/PhotographerPageSetup";

// Components
import Navbar from "./components/shared/Navbar";
import AuthRoute from "./util/AuthRoute";

// API
import API from "./api";

// Stripe
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
// import setUpProfile from "./pages/setUpProfile";
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

  breakpoints: {
    values: {
      xs: 0, // 0-500
      sm: 500, // 500-899
      md: 900, // 900-1280
      lg: 1280,
      xl: 1920,
    },
  },

  typography: {
    useNextVariants: true,
  },

  spreadThis: {
    authContainer: {
      height: "100vh",
      padding: "0 10px",
    },
    auth: {
      maxWidth: "500px",
      margin: "auto",
      textAlign: "center",
    },
    bottomAuth: {
      maxWidth: "500px",
      margin: "auto",
      padding: "15px 0px",
      marginTop: 15,
      textAlign: "center",
    },
    extendedIcon: {
      marginRight: 5,
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
    paperComponent: {
      width: "100%",
      margin: "10px 0px",
      padding: "15px 0px",
    },
    textStyle: {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
      paddingBottom: "15px",
      fontWeight: "bold",
    },
    noOverflow: {
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
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
      height: "50vh",
      width: "100%",
      objectFit: "cover",
      clipPath: "polygon(0 0, 0 100%, 100% 75%, 100% 0)",
      zIndex: "auto",
    },

    timeslots: {
      width: "120px",
      display: "flex",
      margin: "0 auto",
    },

    userCard: {
      zIndex: 1,
      marginTop: "100px",
    },

    avatarContainer: {
      width: "35vh",
      paddingBottom: "35vh",
      borderRadius: "50%",
      position: "relative",
      overflow: "hidden",
      border: "5px solid #fff",
      zIndex: 1,
      margin: "0 auto",
    },
    avatar: {
      position: "absolute",
      height: "100%",
      top: 0,
      left: 0,
    },

    notFullWidth: {
      margin: "15px",
    },

    textGrid: {
      marginLeft: "25px",
    },

    rightGrid: {
      textAlign: "right",
    },

    spacedButton: {
      margin: "10px",
    },

    mediumPaperContainer: {
      padding: 15,
      maxWidth: 700,
      margin: "0 auto",
    },
    bookButton: {
      marginRight: "10px",
      marginLeft: "10px",
      marginTop: "12px",
    },
    dateContainer: {
      maxWidth: 330,
    },
    timeContainer: {
      maxWidth: 450,
    },
  },
});

const token = localStorage.FirebaseIdToken;

if (token) {
  const decodedToken = tokenDecoder(token);
  if (decodedToken.exp * 2000 < Date.now()) {
    store.dispatch(logoutUser());
    window.location.href = "/login";
  } else {
    store.dispatch({ type: "SET_AUTHENTICATED" });
    API.defaults.headers.common["Authorization"] = token;
    store.dispatch(getUserData());
  }
}

const App = () => {
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));
  const halfScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <div className="App">
          <BrowserRouter>
            <Navbar />

            <Switch>
              <Route
                exact
                path="/"
                render={(props) => (
                  <Home
                    {...props}
                    halfScreen={halfScreen}
                    fullScreen={fullScreen}
                  />
                )}
              />

              <Route
                exact
                path="/photographers/:photographerID"
                component={specificPhotographer}
              />

              <AuthRoute
                exact
                path="/yourPhotographyProfile"
                component={editPhotographyPage}
                fullScreen={halfScreen}
              />

              <Route exact path="/login" component={login} />

              <div className="container">
                <Route exact path="/signup" component={signup} />

                <Route
                  exact
                  path="/search"
                  render={(props) => (
                    <Search {...props} fullScreen={halfScreen} />
                  )}
                />

                {/* <AuthRoute
                  exact
                  path="/setupProfile"
                  component={setUpProfile}
                /> */}

                <Route exact path="/resetPassword" component={resetPassword} />

                <AuthRoute exact path="/onboard" component={onboard} />

                <AuthRoute exact path="/onboard/refresh" component={refresh} />

                <AuthRoute
                  exact
                  path="/photographerPageSetup"
                  component={photographerPageSetup}
                />

                <AuthRoute
                  exact
                  path="/onboard/success"
                  component={successPage}
                />

                <AuthRoute exact path="/onboard/refresh" component={onboard} />

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

                <AuthRoute
                  exact
                  path="/profile"
                  component={profile}
                  fullScreen={halfScreen}
                />

                <AuthRoute exact path="/messaging" component={messaging} />

                <AuthRoute
                  exact
                  path="/vault/:orderID"
                  component={photoVault}
                  fullScreen={halfScreen}
                />

                <Route
                  exact
                  path="/search/:searchQuery"
                  render={(props) => (
                    <Search {...props} fullScreen={fullScreen} />
                  )}
                />

                <AuthRoute
                  exact
                  path="/yourPhotographyProfile/setYourSchedule"
                  component={setYourSchedule}
                  fullScreen={fullScreen}
                />

                <AuthRoute
                  exact
                  path="/uploadPhotographyPictures"
                  component={photographyPictures}
                />

                <Route
                  exact
                  path="/photographers/:photographerID/book"
                  render={(props) => (
                    <Book
                      {...props}
                      halfScreen={halfScreen}
                      fullScreen={fullScreen}
                    />
                  )}
                />

                <Elements stripe={stripePromise}>
                  <AuthRoute
                    exact
                    path="/photographers/:photographerID/book/checkout"
                    component={checkout}
                    fullScreen={fullScreen}
                  />
                </Elements>
              </div>
            </Switch>
          </BrowserRouter>
        </div>
      </Provider>
    </MuiThemeProvider>
  );
};

export default App;
