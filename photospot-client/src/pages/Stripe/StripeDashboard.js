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

import { getUserDataWithoutChecks } from "../../redux/actions/userActions";
import GoBackButton from "../../components/Shared/Buttons/GoBackButton";

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
      const values = Object.values(details);

      values.forEach((task) =>
        Object.entries(task).forEach(([key, value]) => {
          this.assignStates(key, value);
        })
      );
    }
  }

  componentDidMount() {
    this.props.getUserData2().then(() => {
      this.assignValues(this.props.credentials);
    });
    this.props.getStripeStatus().then(() => {
      console.log(this.props.stripeStatus);
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
      <>
        <Container maxWidth="sm">
          <Paper style={{ padding: "20px", marginBottom: "12px" }}>
            <Typography variant="h">
              This page is required to use PhotoSpot. Without connecting your
              bank information, you will not be listed in searches for
              photographers.
            </Typography>
          </Paper>

          {console.log(this.state.stripe)}
          {this.state.stripe ? (
            <Paper
              style={{
                textAlign: "center",
                padding: "20px",
                margin: "10px 0px",
              }}
            >
              <Typography>
                Stripe Status:{" "}
                <span style={{ color: "#23ba8b" }}>Connected</span>
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.handleDashboard()}
                disabled={!this.state.stripe}
              >
                Stripe Dashboard
              </Button>
            </Paper>
          ) : (
            <Paper style={{ textAlign: "center", padding: "20px" }}>
              <Typography>
                Stripe Status:{" "}
                <span style={{ color: "red" }}>Not Connected</span>
              </Typography>
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
        </Container>
      </>
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
  getUserData2: getUserDataWithoutChecks,
  getStripeDashboard,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(StripeDashboard));
