import API from "../../api";

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: "LOADING_UI" });
  API.post("/login", userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: "CLEAR_ERRORS" });
      history.push("/");
    })
    .catch((err) => {
      dispatch({
        type: "SET_ERRORS",
        payload: err.response.data,
      });
    });
};

export const signupUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: "LOADING_UI" });
  API.post("/signup", newUserData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: "CLEAR_ERRORS" });
      history.push("/");
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

const setAuthorizationHeader = (token) => {
  const FirebaseIdToken = `Bearer ${token}`;
  localStorage.setItem("FirebaseIdToken", FirebaseIdToken);
  // set the header for authorization to allow authorized routes
  API.defaults.headers.common["Authorization"] = FirebaseIdToken;
};
