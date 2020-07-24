const intialState = {
  allPhotographers: [],
  searchPhotographer: [],
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

    case "SEARCH_PHOTOGRAPHERS":
      return {
        ...state,
        allPhotographers: { ...action.payload },
      };

    case "FILTER_PHOTOGRAPHERS":
      return {
        ...state,
        allPhotographers: { ...action.payload },
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
