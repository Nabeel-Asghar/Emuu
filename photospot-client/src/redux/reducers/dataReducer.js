const intialState = {
  allPhotographers: [],
  allMessages: [],
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
    default:
      return state;
  }
}
