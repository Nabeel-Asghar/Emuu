const intialState = {
  access: null,
  vaultData: "",
};

export default function (state = intialState, action) {
  switch (action.type) {
    case "VAULT_PERMISSION":
      return {
        ...state,
        access: action.payload,
      };

    case "VAULT_DETAILS":
      return {
        ...state,
        vaultData: { ...action.payload },
      };

    default:
      return state;
  }
}
