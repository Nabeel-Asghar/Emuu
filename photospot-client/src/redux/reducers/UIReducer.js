const intialState = {
  loading: false,
  errors: {},
};

export default function (state = intialState, action) {
  switch (action.type) {
    case "SET_ERRORS":
      return {
        ...state,
        loading: false,
        ...action.payload.data,
      };

    case "CLEAR_ERRORS":
      return {
        ...state,
        loading: false,
        errors: null,
      };

    case "LOADING_UI":
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
}
