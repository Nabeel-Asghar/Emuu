import API from "../../api";
import store from "../store";

// export const getPhotographerPage = (photographerID) => (dispatch) => {
//   dispatch({ type: LOADING_DATA });
//   API.get(`/photographers/${photographerID}`)
//     .then((res) => {
//       dispatch({
//         type: SET_PHOTOGRAPHERS,
//         payload: res.data,
//       });
//     })
//     .catch(() => {
//       dispatch({
//         type: SET_PHOTOGRAPHERS,
//         payload: null,
//       });
//     });
// };

export const getPhotographers = () => (dispatch) => {
  dispatch({ type: "LOADING_UI" });
  API.get("photographers")
    .then((res) => {
      dispatch({
        type: "SET_PHOTOGRAPHERS",
        payload: res.data,
      });
      dispatch({ type: "CLEAR_ERRORS" });
    })
    .catch(() =>
      dispatch({
        type: "SET_PHOTOGRAPHERS",
        payload: null,
      })
    );
};

export const getPhotographerPage = (photographerID) => (dispatch) => {
  dispatch({ type: "LOADING_DATA" });
  API.get(`/photographers/${photographerID}`)
    .then((res) => {
      console.log("Getting photographer page details");
      dispatch({
        type: "SET_PHOTOGRAHPER_PAGE",
        payload: res.data,
      });
      dispatch({ type: "CLEAR_ERRORS" });
    })
    .catch(() => {
      dispatch({
        type: "SET_PHOTOGRAHPER_PAGE",
        payload: [null],
      });
    });
};

export const searchPhotographer = (searchQuery) => (dispatch) => {
  dispatch({ type: "LOADING_DATA" });
  API.get(`search/${searchQuery}`)
    .then((res) => {
      dispatch({
        type: "SEARCH_PHOTOGRAPHERS",
        payload: res.data,
      });
    })
    .catch(() => {
      dispatch({
        type: "SEARCH_PHOTOGRAPHERS",
        payload: null,
      });
    });
  dispatch({ type: "FINISH_LOADING_DATA" });
};

export const applyFilters = (type, city, state) => (dispatch) => {
  dispatch({ type: "LOADING_DATA" });
  API.get(`/filter/${type}/${city}/${state}`)
    .then((res) => {
      dispatch({
        type: "FILTER_PHOTOGRAPHERS",
        payload: res.data,
      });
    })
    .catch(() => {
      dispatch({
        type: "FILTER_PHOTOGRAPHERS",
        payload: null,
      });
    });
  dispatch({ type: "FINISH_LOADING_DATA" });
};

export const getBookingTimes = (photographerID) => (dispatch) => {
  dispatch({ type: "LOADING_DATA" });
  return API.get(`/photographers/${photographerID}/bookingTimes`)
    .then((res) => {
      dispatch({
        type: "GET_BOOKING_TIMINGS",
        payload: res.data,
      });
      dispatch({ type: "FINISH_LOADING_DATA" });
    })
    .catch((err) => {
      dispatch({ type: "GENERAL_ERROR" });
    });
};

export const bookPhotographer = (photographerID, bookingDetails) => (
  dispatch
) => {
  return API.post(`/photographers/${photographerID}/book`, bookingDetails)
    .then((res) => {
      console.log(res.data);
      dispatch({ type: "BOOK_PHOTOGRAPHER", payload: res.data });
      dispatch({ type: "SET_SUCCESS_RESPONSE" });
    })
    .catch((err) => {
      dispatch({
        type: "SET_ERRORS",
        payload: err.response.data,
      });
    });
};

export const getReviews = (photographerID) => (dispatch) => {
  dispatch({
    type: "LOADING_REVIEWS",
  });
  dispatch({ type: "RESET_REVIEW_STATE" });
  return API.get(`/photographers/${photographerID}/getReviews`)
    .then((res) => {
      dispatch({
        type: "SET_REVIEWS",
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: "SET_REVIEWS",
        payload: [null],
      });
    });
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

export const editReview = (data) => (dispatch) => {
  API.post("/userDashboard/editReview", data)
    .then((res) => {
      console.log(res.data);
      dispatch({
        type: "SET_RESPONSE_NEW_REVIEW_SUCCESS",
      });
    })
    .catch((err) =>
      dispatch({
        type: "SET_ERRORS",
        payload: err.response.data,
      })
    );
};

export const deleteReview = (data) => (dispatch) => {
  API.post("/userDashboard/deleteReview", data)
    .then((res) => {
      console.log(res.data);
      dispatch({ type: "SET_RESPONSE_NEW_REVIEW_SUCCESS" });
    })
    .catch((err) =>
      dispatch({
        type: "SET_ERRORS",
        payload: err.response.data,
      })
    );
};
