import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Redirect, Link } from "react-router-dom";

import {
  onboardStripe,
  getStripeStatus,
  getStripeDashboard,
} from "../../redux/actions/paymentActions";

import { getUserData } from "../../redux/actions/userActions";

const styles = (theme) => ({
  ...theme.spreadThis,
});

export class StripeDashboard extends Component {
  constructor() {
    super();
    this.state = {
      photographer: true,
      stripe: true,
    };
  }

  assignStates = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  assignValues(details) {
    if (details) {
      const photoDetails = Object.values(details);

      photoDetails.forEach((task) =>
        Object.entries(task).forEach(([key, value]) => {
          this.assignStates(key, value);
        })
      );
    }
  }

  componentDidMount() {
    this.props.getUserData().then(() => {
      this.assignValues(this.props.credentials);
    });
    this.props.getStripeStatus().then(() => {
      if (!this.props.stripeStatus) {
        this.setState({ stripe: false });
      }
    });
  }

  handleClick() {
    this.props.onboardStripe();
  }

  handleDashboard() {
    this.props.getStripeDashboard();
  }

  render() {
    if (this.state.photographer === false) {
      return <Redirect to="/" />;
    }
    return (
      <Container maxWidth="sm">
        <Paper style={{ padding: "20px", marginBottom: "12px" }}>
          <Typography>
            Stripe Status:{" "}
            {this.state.stripe ? (
              <span style={{ color: "#23ba8b" }}>Connected</span>
            ) : (
              <span style={{ color: "red" }}>Not Connected</span>
            )}
          </Typography>
        </Paper>
        {!this.state.stripe && (
          <Paper style={{ textAlign: "center", padding: "20px" }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.handleClick()}
              disabled={this.state.stripe}
            >
              Setup payouts with Stripe
            </Button>
          </Paper>
        )}
        {this.state.stripe && (
          <Paper
            style={{ textAlign: "center", padding: "20px", margin: "10px 0px" }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={() => this.handleDashboard()}
              disabled={!this.state.stripe}
            >
              Stripe Dashboard
            </Button>
          </Paper>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
  url: state.user.url,
  stripeStatus: state.payment.stripeStatus,
  photographerStatus: state.user.credentials[0]?.photographer,
});

const mapActionsToProps = {
  getStripeStatus,
  onboardStripe,
  getUserData,
  getStripeDashboard,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(StripeDashboard));
