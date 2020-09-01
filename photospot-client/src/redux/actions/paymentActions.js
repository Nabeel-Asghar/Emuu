import API from "../../api";

export const onboardStripe = () => (dispatch) => {
  dispatch({ type: "LOADING_UI" });
  API.post("/onboard-user")
    .then((res) => {
      console.log(res.data.url);
      window.location.assign(`${res.data.url}`);
    })
    .catch((err) => {
      dispatch({ type: "GENERAL_ERROR" });
    });
};
