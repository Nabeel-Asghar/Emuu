import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({
  ...theme.spreadThis,
  margin: {
    margin: theme.spacing(2),
  },
});

export class successPage extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div style={{ width: "100%" }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={1}
          m={1}
          css={{ height: "75vh" }}
        >
          <Box p={1}>
            <Paper style={{ width: "300px", textAlign: "center" }}>
              <CheckCircleIcon color="secondary" style={{ fontSize: 120 }} />
              <Typography variant="h5">Success!</Typography>
              <Typography variant="h6">
                You have been connected to Stripe.
              </Typography>
              <Button
                component={Link}
                to="/"
                variant="contained"
                color="secondary"
                className={classes.margin}
              >
                Go back
              </Button>
            </Paper>
          </Box>
        </Box>
      </div>
    );
  }
}

export default withStyles(styles)(successPage);
