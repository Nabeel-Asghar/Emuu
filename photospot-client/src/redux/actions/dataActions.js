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
      // this.setState({
      //   allPhotographers: res.data,
      // });
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
