import API from "../../api";

export const onboardStripe = () => (dispatch) => {
  dispatch({ type: "LOADING_UI" });
  API.post("/onboard-user")
    .then((res) => {
      window.location.assign(`${res.data.url}`);
    })
    .catch((err) => {
      dispatch({ type: "GENERAL_ERROR" });
    });
};

export const customerPayment = (photographerID, bookingDetails) => (
  dispatch
) => {
  console.log(bookingDetails);
  API.post(`/photographers/${photographerID}/book/checkout`, bookingDetails)
    .then((res) => {
      dispatch({
        type: "SET_STRIPE_CLIENT_SECRET",
        payload: res.data.client_secret,
      });
    })
    .catch((err) => {
      dispatch({ type: "SET_STRIPE_CLIENT_SECRET", payload: null });
    });
};

export const getStripeStatus = () => (dispatch) => {
  return API.get("/onboard-status")
    .then((res) => {
      console.log(res.data.status);
      dispatch({
        type: "SET_STRIPE_STATUS",
        payload: res.data.status,
      });
    })
    .catch(() => {
      dispatch({
        type: "SET_STRIPE_STATUS",
        payload: null,
      });
    });
};

export const refund = (paymentID) => (dispatch) => {
  API.post("/user/refund", paymentID)
    .then(() => {
      console.log("you pierre you wanna get out here");
    })
    .catch((err) => {
      dispatch({
        type: "SET_REFUND_ERROR",
        payload: err.response.data,
      });
    });
};
