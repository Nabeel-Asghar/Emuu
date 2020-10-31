import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

export class goBackButton extends Component {
  render() {
    return (
      <Button
        color="secondary"
        onClick={() => this.props.history.goBack()}
        disabled={this.props.disabled}
        startIcon={<ArrowBackIosIcon />}
      >
        Go Back
      </Button>
    );
  }
}

export default goBackButton;
