import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";

import { onboardStripe } from "../redux/actions/paymentActions";

const styles = (theme) => ({
  ...theme.spreadThis,
});

export class onboard extends Component {
  handleClick() {
    console.log("click");
    this.props.onboardStripe();
  }
  render() {
    return (
      <div>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => this.handleClick()}
        >
          Setup payouts with Stripe
        </Button>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  url: state.user.url,
});

const mapActionsToProps = {
  onboardStripe,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(onboard));
