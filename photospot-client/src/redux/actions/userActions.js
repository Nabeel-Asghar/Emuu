import API from "../../api";

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: "LOADING_UI" });
  API.post("/login", userData)
    .then((res) => {
      const FirebaseIdToken = `Bearer ${res.data.token}`;
      localStorage.setItem("FirebaseIdToken", FirebaseIdToken);
      // set the header for authorization to allow authorized routes
      API.defaults.headers.common["Authorization"] = FirebaseIdToken;
      dispatch(getUserData());
      dispatch({ type: "CLEAR_ERRORS" });
      history.push("/");
    })
    .catch((err) => {
      console.log("here");
      dispatch({
        type: "SET_ERRORS",
        payload: err.response.data,
      });
    });
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
