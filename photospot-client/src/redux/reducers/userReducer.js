const intialState = {
  authenticated: false,
  credentials: {},
  yourPhotographyPageDetails: {},
  userOrders: [],
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

    case "SET_YOUR_PHOTOGRAPHY_PAGE":
      return {
        authenticated: true,
        yourPhotographyPageDetails: { ...action.payload },
      };

    case "SET_USERS_ORDERS":
      return {
        authenticated: true,
        userOrders: { ...action.payload },
      };
    default:
      return state;
  }
}
