const intialState = {
  loading: false,
  loadingData: false,
  loadingReviews: false,
  loadingReviewAction: false,
  loadingAction: false,
  newReviewSucess: "",
  theResponse: "",
  deleteImagesResponse: null,
  uploadImagesResponse: null,
  editBookingTimesResponse: "",
  generalError: false,
  errors: {},
};

export default function (state = intialState, action) {
  switch (action.type) {
    case "SET_ERRORS":
      return {
        ...state,
        errors: { ...action.payload },
        loading: false,
        loadingAction: false,
      };

    case "CLEAR_ERRORS":
      return {
        loading: false,
        loadingData: false,
        loadingReviews: false,
        loadingReviewAction: false,
        loadingAction: false,
        newReviewSucess: "",
        theResponse: "",
        deleteImagesResponse: null,
        uploadImagesResponse: null,
        editBookingTimesResponse: "",
        generalError: false,
        errors: {},
      };

    case "LOADING_UI":
      return {
        ...state,
        loading: true,
      };

    case "LOADING_DATA":
      return {
        ...state,
        loadingData: true,
      };

    case "FINISH_LOADING_DATA":
      return {
        ...state,
        loadingData: false,
      };

    case "LOADING_REVIEWS":
      return {
        ...state,
        loadingReviews: true,
      };

    case "RESET_PASSWORD":
      return {
        ...state,
      };

    case "CHANGE_PASSWORD":
      return {
        ...state,
      };

    case "LOADING_REVIEW_ACTION":
      return {
        ...state,
        loadingReviewAction: true,
      };

    case "SET_RESPONSE":
      return {
        ...state,
        theResponse: action.response,
      };
    case "SET_RESPONSE_DELETE_IMAGES":
      return {
        ...state,
        deleteImagesResponse: action.response,
      };
    case "SET_RESPONSE_UPLOAD_IMAGES":
      return {
        ...state,
        uploadImagesResponse: action.response,
      };

    case "SET_RESPONSE_NEW_REVIEW_ERROR":
      return {
        ...state,
        errors: { ...action.payload },
        loadingReviewAction: false,
      };

    case "SET_RESPONSE_NEW_REVIEW_SUCCESS":
      return {
        ...state,
        newReviewSucess: "Thank you for your feedback!",
        loadingReviewAction: false,
      };

    case "RESET_REVIEW_STATE":
      return {
        ...state,
        newReviewSucess: "",
      };

    case "LOADING_POST_ACTION":
      return {
        ...state,
        loadingAction: true,
      };

    case "SET_SUCCESS_RESPONSE":
      return {
        ...state,
        generalError: false,
        loadingAction: false,
      };

    case "GENERAL_ERROR":
      return {
        ...state,
        generalError: true,
        loadingAction: false,
      };

    default:
      return state;
  }
}
