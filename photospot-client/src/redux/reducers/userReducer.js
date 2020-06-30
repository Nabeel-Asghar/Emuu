const intialState = {
  authenticated: false,
  credentials: [],
};

export default function (state = intialState, action) {
  switch (action.type) {
    case "SET_AUTHENTICATED":
      return {
        ...state,
        authenticated: true,
      };
    case "SET_UNAUTHENTICATED":
      return {
        intialState,
      };
    case "SET_USER":
      return {
        authenticated: true,
        credentials: { ...action.payload },
      };
    default:
      return state;
  }
}
