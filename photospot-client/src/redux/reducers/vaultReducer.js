const intialState = {
  access: null,
  loading: false,
  vaultData: "",
  vaultSize: [],
  uploadResponse: "",
  deleteResponse: "",
  progress: 0,
  finalizeResponse: "",
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
        uploadResponse: action.payload,
      };

    case "DELETE_RESPONSE":
      return {
        ...state,
        deleteResponse: action.payload,
      };

    case "VAULT_SIZE":
      return {
        ...state,
        vaultSize: { ...action.payload },
      };

    case "VAULT_LOADING":
      return {
        ...state,
        loading: true,
      };

    case "FINALIZE_RESPONSE":
      return {
        ...state,
        finalizeResponse: action.payload,
      };
    default:
      return state;
  }
}
