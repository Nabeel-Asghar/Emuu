import { Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import React from "react";

const SnackbarAlert = (props) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      open={props.open}
      autoHideDuration={8000}
      onClose={props.handleClose}
    >
      <Alert
        variant="filled"
        onClose={props.handleClose}
        severity={props.severity}
        classes={{
          icon: {
            color: "white",
            fill: "white",
          },
        }}
      >
        {props.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
