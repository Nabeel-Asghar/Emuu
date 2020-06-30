const intialState = {
  allPhotographers: [],
  allMessages: [],
  photographerPage: [],
  timings: [],
};

export default function (state = intialState, action) {
  switch (action.type) {
    case "SET_PHOTOGRAPHERS":
      return {
        ...state,
        allPhotographers: { ...action.payload },
      };
    case "SET_MESSAGES":
      return {
        ...state,
        allMessages: { ...action.payload },
      };
    case "SET_PHOTOGRAHPER_PAGE":
      return {
        ...state,
        photographerPage: [...action.payload],
      };
    case "GET_BOOKING_TIMINGS":
      return {
        ...state,
        timings: [...action.payload],
      };
    case "BOOK_PHOTOGRAHPER":
      return {
        ...state,
      };
    default:
      return state;
  }
}
