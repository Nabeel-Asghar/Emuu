const intialState = {
  loading: false,
  loadingData: false,
  loadingReviews: false,
  loadingReviewAction: false,
  loadingAction: false,
  newReviewSucess: "",
  theResponse: "",
  theDeleteImagesResponse: "",
  theUploadImagesResponse: "",
  editBookingTimesResponse: "",
  generalError: false,
};

export default function (state = intialState, action) {
  switch (action.type) {
    case "SET_ERRORS":
      return {
        ...state,
        errors: { ...action.payload },
        loading: false,
      };

    case "CLEAR_ERRORS":
      return {
        ...state,
        loading: false,
        loadingData: false,
        loadingReviews: false,
        loadingReviewAction: false,
        errors: null,
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
        theDeleteImagesResponse: action.response,
      };
    case "SET_RESPONSE_UPLOAD_IMAGES":
      return {
        ...state,
        theUploadImagesResponse: action.response,
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
