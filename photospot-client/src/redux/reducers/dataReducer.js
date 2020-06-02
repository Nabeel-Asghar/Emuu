const intialState = {
  allPhotographers: [],
};

export default function (state = intialState, action) {
  switch (action.type) {
    case "SET_PHOTOGRAPHERS":
      return {
        ...state,
        allPhotographers: { ...action.payload },
      };
    default:
      return state;
  }
}
