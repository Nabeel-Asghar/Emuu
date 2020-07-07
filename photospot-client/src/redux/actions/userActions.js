import API from "../../api";
import history from "../../util/history";

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: "LOADING_UI" });
  API.post("/login", userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: "CLEAR_ERRORS" });
    })
    .catch((err) => {
      dispatch({
        type: "SET_ERRORS",
        payload: err.response.data,
      });
    });
};

export const signupUser = (newUserData) => (dispatch) => {
  dispatch({ type: "LOADING_UI" });
  API.post("/signup", newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch(redirect("/profileImage"));
    })
    .catch((err) => {
      dispatch({
        type: "SET_ERRORS",
        payload: err.response.data,
      });
    });
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FirebaseIdToken");
  delete API.defaults.headers.common["Authorization"];
  dispatch({ type: "SET_UNAUTHENTICATED" });
  dispatch(redirect("/login"));
};

export const getUserData = () => (dispatch) => {
  API.get("/youruserprofile")
    .then((res) => {
      dispatch({
        type: "SET_USER",
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const redirect = (location) => (dispatch) => {
  history.push(location);
};

export const uploadProfileImage = (formData) => (dispatch) => {
  API.post("/user/profileimage", formData)
    .then((res) => {
      console.log(res.data);
      dispatch(getUserData());
      dispatch({ type: "SET_RESPONSE", response: res.data });
    })
    .catch((err) => console.log(err));
};

export const getYourPhotographyPage = () => (dispatch) => {
  return API.get("/yourphotographerpage")
    .then((res) => {
      dispatch({ type: "SET_YOUR_PHOTOGRAPHY_PAGE", payload: res.data });
      return true;
    })
    .catch((err) => console.log(err));
};

const setAuthorizationHeader = (token) => {
  const FirebaseIdToken = `Bearer ${token}`;
  localStorage.setItem("FirebaseIdToken", FirebaseIdToken);
  // set the header for authorization to allow authorized routes
  API.defaults.headers.common["Authorization"] = FirebaseIdToken;
};
