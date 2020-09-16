import React, { Component } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
          onClose={this.props.handleClose}
          severity={errors ? "error" : "success"}
        >
          {errors ? errors.message : "Your changes have been saved"}
        </Alert>
      </Snackbar>
    );
  }
}

export default feedback;
