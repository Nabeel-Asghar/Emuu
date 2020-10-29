const intialState = {
  access: null,
  loading: false,
  vaultData: "",
  vaultSize: [],
  vaultResponse: [],
  progress: 0,
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

    case "VAULT_UPLOAD_PROGRESS":
      return {
        ...state,
        progress: action.payload,
      };

    case "UPLOAD_RESPONSE":
      return {
        ...state,
        vaultResponse: [...state.vaultResponse, action.payload],
      };

    case "DELETE_RESPONSE":
      return {
        ...state,
        vaultResponse: [...state.vaultResponse, action.payload],
      };

    case "VAULT_SIZE":
      return {
        ...state,
        vaultSize: { ...action.payload },
      };
    default:
      return state;
  }
}
