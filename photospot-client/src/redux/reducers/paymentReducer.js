const intialState = {
  client_secret: "",
  refundError: "",
  stripeStatus: null,
};

export default function (state = intialState, action) {
  switch (action.type) {
    case "SET_STRIPE_CLIENT_SECRET":
      return {
        ...state,
        client_secret: action.payload,
      };

    case "SET_STRIPE_STATUS":
      return {
        ...state,
        stripeStatus: action.payload,
      };

    case "SET_REFUND_ERROR":
      return {
        ...state,
        refundError: action.payload,
      };

    default:
      return state;
  }
}
