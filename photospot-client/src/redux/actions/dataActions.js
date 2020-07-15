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
  dispatch({ type: "LOADING_DATA" });
  API.get("photographers")
    .then((res) => {
      dispatch({
        type: "SET_PHOTOGRAPHERS",
        payload: res.data,
      });
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
    })
    .catch(() => {
      dispatch({
        type: "SET_PHOTOGRAHPER_PAGE",
        payload: null,
      });
    });
};

export const getBookingTimes = (photographerID) => (dispatch) => {
  dispatch({ type: "LOADING_DATA" });
  API.get(`/photographers/${photographerID}/bookingTimes`).then((res) => {
    console.log("Getting bookings for that photographer on that date");

    dispatch({
      type: "GET_BOOKING_TIMINGS",
      payload: res.data,
    });
  });
};

export const bookPhotographer = (photographerID, bookingDetails) => (
  dispatch
) => {
  API.post(`/photographers/${photographerID}/book`, bookingDetails)
    .then((res) => {
      console.log(res.data);
      dispatch({ type: "BOOK_PHOTOGRAPHER", payload: res.data });
    })
    .catch((err) => {
      dispatch({
        type: "SET_ERRORS",
        payload: err.response.data,
      });
    });
};

export const getChatList = () => (dispatch) => {
  dispatch({ type: "LOADING_DATA" });
  API.onSnapshot("messages")
    .then((res) => {
      dispatch({
        type: "GET_MESSAGES",
        payload: res.data,
      });
    })
    .catch(() =>
      dispatch({
        type: "GET_MESSAGES",
        payload: null,
      })
    );
};

export const sendMessage = (docKey, sentMessage) => (dispatch) => {
  API.post(`/chats/${docKey}`, sentMessage)
    .then((res) => {
      console.log("2");
      console.log(res.data);
      dispatch({ type: "SEND_MESSAGE", payload: res.data });
    })
    .catch((err) => {
      dispatch({
        type: "SET_ERRORS",
        payload: null,
      });
    });
};
