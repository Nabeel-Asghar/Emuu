import React, { Component } from "react";
import Button from "@material-ui/core/Button";

export class goBackButton extends Component {
  render() {
    return (
      <Button
        variant="contained"
        color="secondary"
        onClick={() => this.props.history.goBack()}
      >
        Go Back
      </Button>
    );
  }
}

export default goBackButton;
