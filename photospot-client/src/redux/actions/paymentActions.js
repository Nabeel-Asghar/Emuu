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

export const refreshStripe = () => (dispatch) => {
  dispatch({ type: "LOADING_UI" });
  API.get("/onboard-user/refresh")
    .then((res) => {
      window.open(`${res.data.url}`, "_blank");
    })
    .catch((err) => {
      return false;
    });
};

export const getStripeDashboard = () => (dispatch) => {
  API.get("/get-stripe-dashboard")
    .then((res) => {
      window.open(`${res.data.url}`, "_blank");
    })
    .catch((err) => {
      return false;
    });
};

export const customerPayment = (photographerID, bookingDetails) => (
  dispatch
) => {
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

export const refund = (orderID) => (dispatch) => {
  //dispatch({ type: "LOADING_UI" });
  API.post("/user/refund", orderID)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const refundFromPhotographer = (orderID) => (dispatch) => {
  //dispatch({ type: "LOADING_UI" });
  API.post("/photographer/refund", orderID)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const getBalance = () => (dispatch) => {
  return API.get("/get-your-balance")
    .then((res) => {
      dispatch({ type: "SET_BALANCE", payload: res.data.balance });
    })
    .catch((err) => {
      dispatch({ type: "SET_BALANCE", payload: 0 });
    });
};
