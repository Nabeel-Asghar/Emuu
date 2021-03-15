const intialState = {
  client_secret: "",
  refundError: "",
  balance: 0,
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

    case "SET_BALANCE":
      return {
        ...state,
        balance: action.payload,
      };

    default:
      return state;
  }
}
