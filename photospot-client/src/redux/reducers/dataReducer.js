const intialState = {
  allPhotographers: [],
  photographerPage: [],
};

export default function (state = intialState, action) {
  switch (action.type) {
    case "SET_PHOTOGRAPHERS":
      return {
        ...state,
        allPhotographers: { ...action.payload },
      };

    case "SET_PHOTOGRAHPER_PAGE":
      return {
        ...state,
        photographerPage: { ...action.payload },
      };
    default:
      return state;
  }
}
