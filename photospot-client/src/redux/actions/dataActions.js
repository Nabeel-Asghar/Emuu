import API from "../../api";

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

export const getChatList = () => (dispatch) => {
  dispatch({ type: "LOADING_DATA" });
  API.get("messages")
    .then((res) => {
      dispatch({
        type: "SET_MESSAGES",
        payload: res.data,
      });
    })
    .catch(() =>
      dispatch({
        type: "SET_MESSAGES",
        payload: null,
      })
    );
};
