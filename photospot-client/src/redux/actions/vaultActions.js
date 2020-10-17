import API from "../../api";
import FileSaver from "file-saver";

export const getVault = (vaultID) => (dispatch) => {
  dispatch({ type: "LOADING_UI" });
  return API.get(`/vault/${vaultID}`)
    .then((res) => {
      dispatch({ type: "VAULT_PERMISSION", payload: res.data.access });
      dispatch({ type: "VAULT_DETAILS", payload: res.data.data });
    })
    .catch((err) => {
      dispatch({
        type: "VAULT_ERROR",
      });
    });
};

export const getDownload = (vaultID) => (dispatch) => {
  API.get(`/vault/${vaultID}/download`, { responseType: "blob" })
    .then((res) => {
      console.log(res);
      console.log(res.data);
      FileSaver.saveAs(res.data);
    })
    .catch(() => {});
};

export const uploadToVault = (vaultID, formData) => (dispatch) => {
  API.post(`/vault/${vaultID}/upload`, formData)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
