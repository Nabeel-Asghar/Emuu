const intialState = {
  client_secret: "",
};

export default function (state = intialState, action) {
  switch (action.type) {
    case "SET_STRIPE_CLIENT_SECRET":
      return {
        ...state,
        client_secret: action.payload,
      };

    default:
      return state;
  }
}
