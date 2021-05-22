import React, { Component } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { theme } from "../../util/Theme";

export class feedback extends Component {
  render() {
    const { open, errors } = this.props;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={open}
        autoHideDuration={6000}
        onClose={this.props.handleClose}
      >
        <Alert
          variant="filled"
          onClose={this.props.handleClose}
          severity={errors ? "warning" : "success"}
          style={!errors && { backgroundColor: theme.main }}
        >
          {errors
            ? errors.message
              ? errors.message
              : "Your changes have not been saved"
            : "Your changes have been saved"}
        </Alert>
      </Snackbar>
    );
  }
}

export default feedback;
