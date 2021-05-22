import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";

export class GoBackButton extends Component {
  render() {
    return (
      <Button
        color="secondary"
        onClick={() => this.props.history.goBack()}
        disabled={this.props.disabled}
        startIcon={<ArrowBackIosIcon />}
        style={{ margin: 5 }}
      >
        Go Back
      </Button>
    );
  }
}

export default GoBackButton;
