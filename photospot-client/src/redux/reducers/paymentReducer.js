const intialState = {
  redirectURL: "",
};

export default function (state = intialState, action) {
  switch (action.type) {
    case "SET_REDIRECT_URL":
      return {
        ...state,
        redirectURL: action.payload,
      };

    default:
      return state;
  }
}
