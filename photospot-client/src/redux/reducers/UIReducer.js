const intialState = {
  loading: false,
  theResponse: "",
  theDeleteImagesResponse: "",
  theUploadImagesResponse: "",
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
    case "SET_RESPONSE":
      return {
        ...state,
        theResponse: action.response,
      };
    case "SET_RESPONSE_DELETE_IMAGES":
      return {
        ...state,
        theDeleteImagesResponse: action.response,
      };
    case "SET_RESPONSE_UPLOAD_IMAGES":
      return {
        ...state,
        theUploadImagesResponse: action.response,
      };
    default:
      return state;
  }
}
