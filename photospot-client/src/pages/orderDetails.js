import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import moment from "moment";

import { getUsersOrders } from "../redux/actions/userActions";
import { refund } from "../redux/actions/paymentActions";

// Material UI
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class orderDetails extends Component {
  constructor() {
    super();
    this.state = {
      docID: "",
      paymentID: "",
      amount: 0,
      firstName: "",
      lastName: "",
      photographerID: "",
      profileImage: "",
      shootDate: "",
      shootTime: "",
      createdAt: "",
      paymentID: "",
    };
  }

  componentDidMount() {
    this.props.getUsersOrders().then(() => {
      console.log(this.props.userOrders[0]);
      this.assignValues(this.props.userOrders);
    });
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

  handleRefund() {
    console.log(this.state.paymentID);
    this.props.refund({ paymentID: this.state.paymentID });
  }

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h5" display="inline">
            Order{" "}
          </Typography>
          <Typography variant="h5" display="inline" style={{ color: "gray" }}>
            #{this.state.docID}
          </Typography>
        </Grid>

        <Grid item xs={4} style={{ textAlign: "center" }}>
          <img
            src={this.state.profileImage}
            style={{
              width: "100%",
              textAlign: "center",
              objectFit: "cover",
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <Paper style={{ padding: 30 }}>
            <Typography variant="h6" gutterBottom>
              Photo shoot with {this.state.firstName} {this.state.lastName}
            </Typography>
            <Typography
              variant="h5"
              gutterBottom
              style={{ fontWeight: "bold" }}
            >
              {moment(this.state.shootTime, "HH:mm").format("h:mm A")} on{" "}
              {moment(this.state.shootDate).format("LL")}
            </Typography>
          </Paper>
          <Paper style={{ padding: 15, marginTop: 10 }}>
            <Grid container>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                <Typography variant="h6">Order Total</Typography>
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
                <Typography variant="h6">${this.state.amount}.00</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Button onClick={() => this.handleRefund()}>Refund</Button>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  userOrders: state.user.userOrders,
});

const mapActionsToProps = {
  getUsersOrders,
  refund,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(orderDetails));
