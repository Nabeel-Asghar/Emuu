import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
// Material UI
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

const styles = (theme) => ({
  ...theme.spreadThis,
  root: {
    background: "#f76a71",
  },
});

class StripeCard extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Paper style={{ marginTop: "5px", padding: "20px 0px 20px 0px" }}>
        <div style={{ textAlign: "center" }}>
          <Tooltip title="You must connect your Stripe to be booked!">
            <Button
              component={Link}
              to="/onboard"
              color="secondary"
              variant="contained"
              classes={{
                root: classes.root,
              }}
            >
              Setup Stripe
            </Button>
          </Tooltip>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(StripeCard);
