import API from "../../api";
import FileSaver from "file-saver";

export const getVault = (vaultID) => (dispatch) => {
  return API.get(`/vault/${vaultID}`)
    .then((res) => {
      dispatch({ type: "VAULT_PERMISSION", payload: res.data.access });
      dispatch({ type: "VAULT_DETAILS", payload: res.data.data });
    })
    .catch((err) => {
      dispatch({
        type: "VAULT_PERMISSION",
        payload: null,
      });
    });
};

export const getDownload = (vaultID) => (dispatch) => {
  return API.get(`/vault/${vaultID}/download`, { responseType: "blob" })
    .then((res) => {
      console.log(res);
      console.log(res.data);
      FileSaver.saveAs(res.data);
    })
    .catch(() => {});
};

export const uploadToVault = (vaultID, formData) => (dispatch) => {
  return API.post(`/vault/${vaultID}/upload`, formData, {
    onUploadProgress: (progressEvent) =>
      dispatch({
        type: "VAULT_UPLOAD_PROGRESS",
        payload: Math.round((progressEvent.loaded * 100) / progressEvent.total),
      }),
  })
    .then((res) => {
      dispatch({
        type: "UPLOAD_RESPONSE",
        payload: "Successfully uploaded image(s).",
      });
    })
    .catch((err) => {
      dispatch({
        type: "UPLOAD_RESPONSE",
        payload: "We couldn't upload to your vault.",
      });
    });
};

export const deleteImages = (vaultID, images) => (dispatch) => {
  API.post(`/vault/${vaultID}/delete`, images)
    .then((res) => {
      dispatch({
        type: "DELETE_RESPONSE",
        payload: "Successfully deleted image(s).",
      });
    })
    .catch((err) => {
      dispatch({
        type: "DELETE_RESPONSE",
        payload: "We couldn't delete from your vault.",
      });
    });
};

export const getSize = (vaultID) => (dispatch) => {
  return API.get(`/vault/${vaultID}/getSize`, vaultID)
    .then((res) => {
      dispatch({ type: "VAULT_SIZE", payload: res.data.size });
    })
    .catch(() => {
      dispatch({ type: "VAULT_SIZE", payload: null });
    });
};

export const notifyCustomer = (vaultID) => (dispatch) => {
  dispatch({ type: "VAULT_LOADING" });
  return API.get(`/vault/${vaultID}/notifyCustomer`, vaultID)
    .then((res) => {
      return true;
    })
    .catch(() => {
      return false;
    });
};

export const confirmPictures = (vaultID) => (dispatch) => {
  dispatch({ type: "VAULT_LOADING" });
  return API.post(`/vault/${vaultID}/finalize`, vaultID)
    .then((res) => {
      dispatch({
        type: "FINALIZE_RESPONSE",
        payload: res.data.response,
      });
    })
    .catch((res) => {
      dispatch({
        type: "FINALIZE_RESPONSE",
        payload: res.data.response,
      });
    });
};
