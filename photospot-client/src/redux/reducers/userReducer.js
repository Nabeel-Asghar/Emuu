const intialState = {
  authenticated: false,
  credentials: {},
  yourPhotographyPageDetails: {},
  userOrders: [],
  userPastOrders: [],
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
        ...state,
        authenticated: true,
        credentials: { ...action.payload },
      };

    case "SET_YOUR_PHOTOGRAPHY_PAGE":
      return {
        ...state,
        yourPhotographyPageDetails: { ...action.payload },
      };

    case "SET_USERS_ORDERS":
      return {
        ...state,
        userOrders: { ...action.payload },
      };

    case "SET_USERS_PAST_ORDERS":
      return {
        ...state,
        userPastOrders: { ...action.payload },
      };

    default:
      return state;
  }
}
