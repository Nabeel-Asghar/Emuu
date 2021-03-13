import React, { Component } from "react";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

class StripeCard extends Component {
  render() {
    return (
      <Paper style={{ marginTop: "5px", padding: "20px 0px 20px 0px" }}>
        <div style={{ textAlign: "center" }}>
          <Tooltip title="You must connect your Stripe to be booked!">
            <Button
              component={Link}
              to="/stripe"
              color="secondary"
              variant="contained"
            >
              Access Stripe
            </Button>
          </Tooltip>
        </div>
      </Paper>
    );
  }
}

export default StripeCard;
