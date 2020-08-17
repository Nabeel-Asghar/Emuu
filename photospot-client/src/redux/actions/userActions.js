import API from "../../api";

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: "LOADING_UI" });
  API.post("/login", userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData()).then(() => {
        dispatch({ type: "CLEAR_ERRORS" });
      });
      history.push("/search");
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
      // setAuthorizationHeader(res.data.token);
      // dispatch(getUserData());
      dispatch({ type: "CLEAR_ERRORS" });
      history.push("/login");
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
  return API.get("/youruserprofile")
    .then((res) => {
      dispatch({
        type: "SET_USER",
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
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
  dispatch({ type: "LOADING_DATA" });
  return API.get("/yourphotographerpage")
    .then((res) => {
      dispatch({ type: "SET_YOUR_PHOTOGRAPHY_PAGE", payload: res.data });
      dispatch({ type: "CLEAR_ERRORS" });
      return true;
    })
    .catch((err) => console.log(err));
};

export const deleteImages = (images) => (dispatch) => {
  dispatch({ type: "LOADING_UI" });
  API.post("/photographyimages/delete", images)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) =>
      dispatch({
        type: "SET_ERRORS",
        payload: err.response.data,
      })
    );
};

export const uploadImages = (images) => (dispatch) => {
  dispatch({ type: "LOADING_UI" });
  API.post("/photographyimages", images)
    .then((res) => {
      console.log(res.data);
      dispatch({ type: "CLEAR_ERRORS" });
    })
    .catch((err) =>
      dispatch({
        type: "SET_ERRORS",
        payload: err.response.data,
      })
    );
};

export const updatePhotographerPage = (details) => (dispatch) => {
  API.post("/editphotographypage/edit", details)
    .then((res) => {
      console.log(res.data);
      dispatch({ type: "CLEAR_ERRORS" });
    })
    .catch((err) =>
      dispatch({
        type: "SET_ERRORS",
        payload: err.response.data,
      })
    );
};

export const editPhotographerCategories = (categories) => (dispatch) => {
  API.post("/editphotographypage/editCategories", categories)
    .then((res) => {
      console.log(res.data);
      dispatch({ type: "CLEAR_ERRORS" });
    })
    .catch((err) =>
      dispatch({
        type: "SET_ERRORS",
        payload: err.response.data,
      })
    );
};

export const uploadBackgroundImage = (image) => (dispatch) => {
  API.post("/editphotographypage/background", image)
    .then((res) => {
      console.log(res.data);
      console.log("Done");
      dispatch({ type: "CLEAR_ERRORS" });
    })
    .catch((err) =>
      dispatch({
        type: "SET_ERRORS",
        payload: err.response.data,
      })
    );
};

export const getPhotographerOrders = () => (dispatch) => {
  return API.get("/yourorders")
    .then((res) => {
      dispatch({
        type: "SET_USERS_ORDERS",
        payload: res.data,
      });
    })
    .catch(() => {
      dispatch({
        type: "SET_USERS_ORDERS",
        payload: null,
      });
    });
};

export const getPhotographerPastOrders = () => (dispatch) => {
  API.get("//yourpastorders")
    .then((res) => {
      dispatch({
        type: "SET_USERS_PAST_ORDERS",
        payload: res.data,
      });
    })
    .catch(() => {
      dispatch({
        type: "SET_USERS_PAST_ORDERS",
        payload: null,
      });
    });
};

export const getUsersOrders = () => (dispatch) => {
  return API.get("/youruserprofile/orders")
    .then((res) => {
      dispatch({
        type: "SET_USERS_ORDERS",
        payload: res.data,
      });
    })
    .catch(() => {
      dispatch({
        type: "SET_USERS_ORDERS",
        payload: null,
      });
    });
};

export const getUsersPastOrders = () => (dispatch) => {
  API.get("/youruserprofile/pastorders")
    .then((res) => {
      dispatch({
        type: "SET_USERS_PAST_ORDERS",
        payload: res.data,
      });
    })
    .catch(() => {
      dispatch({
        type: "SET_USERS_PAST_ORDERS",
        payload: null,
      });
    });
};

export const updateUserProfile = (details) => (dispatch) => {
  API.post("/youruserprofile/edit", details)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export const reviewPhotographer = (photographerID, details) => (dispatch) => {
  dispatch({ type: "LOADING_REVIEW_ACTION" });
  API.post(`/photographers/${photographerID}/review`, details)
    .then((res) => {
      dispatch({
        type: "SET_RESPONSE_NEW_REVIEW_SUCCESS",
      });
    })
    .catch((err) => {
      console.log(err.response.data);
      dispatch({
        type: "SET_RESPONSE_NEW_REVIEW_ERROR",
        payload: err.response.data,
      });
    });
};

export const editBookingTimes = (dateAndTime) => (dispatch) => {
  dispatch({ type: "LOADING_POST_ACTION" });
  return API.post(`/editphotographypage/bookingTimes`, dateAndTime)
    .then(() => {
      dispatch({ type: "SET_SUCCESS_RESPONSE" });
    })
    .catch((err) => {
      dispatch({ type: "GENERAL_ERROR" });
    });
};

const setAuthorizationHeader = (token) => {
  const FirebaseIdToken = `Bearer ${token}`;
  localStorage.setItem("FirebaseIdToken", FirebaseIdToken);
  // set the header for authorization to allow authorized routes
  API.defaults.headers.common["Authorization"] = FirebaseIdToken;
};
