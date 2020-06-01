const intialState = {
  loading: false,
};

export default function (state = intialState, action) {
  switch (action.type) {
    case "SET_ERRORS":
      return {
        errors: { ...action.payload },
        loading: false,
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
