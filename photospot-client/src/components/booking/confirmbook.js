import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { timeConvert } from "../../util/timeConvert";

class confirmbook extends Component {
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm booking?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Would you like to confirm booking with {this.props.firstName}{" "}
            {this.props.lastName} on {this.props.date} at{" "}
            {timeConvert(this.props.time)}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.props.handleDisagree}
            variant="contained"
            color="primary"
          >
            Disagree
          </Button>
          <Button
            onClick={this.props.handleAgree}
            variant="contained"
            color="secondary"
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default confirmbook;
