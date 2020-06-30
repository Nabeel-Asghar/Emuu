const intialState = {
  authenticated: false,
<<<<<<< HEAD
  credentials: [],
=======
  credentials: {},
>>>>>>> f6f2e4d0008379332d02dbe06981f3b05a563249
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
