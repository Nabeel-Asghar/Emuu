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
import Login from "./pages/Landing/Login";
import Signup from "./pages/Landing/Signup";
import ResetPassword from "./pages/ChangePassword/ResetPassword";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import ResetPasswordSent from "./pages/ChangePassword/ResetPasswordSent";
import ChangePasswordSent from "./pages/ChangePassword/ChangePasswordSent";
import Messaging from "./pages/Messaging/Messaging";
import SpecificPhotographer from "./pages/Photographer/SpecificPhotographer";
import Book from "./pages/Booking/Book";
import Profile from "./pages/Landing/Profile";
import Search from "./pages/Search/Search";
import EditPhotographyPage from "./pages/EditPhotographerPage/EditPhotographyPage";
import PhotographyPictures from "./pages/EditPhotographerPage/PhotographyPictures";
import Home from "./pages/Landing/Home";
import SetYourSchedule from "./pages/EditPhotographerPage/SetYourSchedule";
import UserDashboard from "./pages/Dashboards/UserDashboard";
import PhotographerDashboard from "./pages/Dashboards/PhotographerDashboard";
import SuccessPage from "./pages/Stripe/SuccessStripe";
import Checkout from "./pages/Booking/Checkout";
import PhotoVault from "./pages/PhotoVault/PhotoVault";
import PhotographerPageSetup from "./components/SignUp/PhotographerPageSetup";
import StripeDashboard from "./pages/Stripe/StripeDashboard";
import Refresh from "./pages/Stripe/Refresh";
import NotFound from "./pages/Landing/NotFound";

// Components
import Navbar from "./components/Shared/Navbar";
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
      padding: 10,
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
      margin: "0px 20px",
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
                render={(props) => (
                  <SpecificPhotographer {...props} fullScreen={fullScreen} />
                )}
              />

              <AuthRoute
                exact
                path="/yourPhotographyProfile"
                component={EditPhotographyPage}
                fullScreen={halfScreen}
              />

              <Route exact path="/login" component={Login} />

              <div className="container">
                <Route exact path="/signup" component={Signup} />

                <Route
                  exact
                  path="/search"
                  render={(props) => (
                    <Search {...props} fullScreen={halfScreen} />
                  )}
                />

                <Route exact path="/resetPassword" component={ResetPassword} />

                <AuthRoute exact path="/stripe" component={StripeDashboard} />

                <AuthRoute exact path="/stripe/refresh" component={Refresh} />

                <AuthRoute
                  exact
                  path="/photographerPageSetup"
                  component={PhotographerPageSetup}
                />

                <AuthRoute
                  exact
                  path="/stripe/success"
                  component={SuccessPage}
                />

                <Route
                  exact
                  path="/resetPasswordSent"
                  component={ResetPasswordSent}
                />

                <AuthRoute
                  exact
                  path="/changePassword"
                  component={ChangePassword}
                />

                <AuthRoute
                  exact
                  path="/changePasswordSent"
                  component={ChangePasswordSent}
                />

                <AuthRoute
                  exact
                  path="/userDashboard"
                  component={UserDashboard}
                />

                <AuthRoute
                  exact
                  path="/photographerDashboard"
                  component={PhotographerDashboard}
                />

                <AuthRoute
                  exact
                  path="/profile"
                  component={Profile}
                  fullScreen={halfScreen}
                />

                <AuthRoute exact path="/messaging" component={Messaging} />

                <AuthRoute
                  exact
                  path="/vault/:orderID"
                  component={PhotoVault}
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
                  component={SetYourSchedule}
                  fullScreen={fullScreen}
                />

                <AuthRoute
                  exact
                  path="/uploadPhotographyPictures"
                  component={PhotographyPictures}
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
                    component={Checkout}
                    fullScreen={fullScreen}
                  />
                </Elements>
              </div>
              <Route path="*" component={NotFound} />
            </Switch>
          </BrowserRouter>
        </div>
      </Provider>
    </MuiThemeProvider>
  );
};

export default App;
