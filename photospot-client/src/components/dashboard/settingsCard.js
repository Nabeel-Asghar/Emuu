import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
// Material UI
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({
  ...theme.spreadThis,
  textLabels: {
    paddingBottom: "15px",
    fontWeight: "bold",
  },
});

class settingsCard extends Component {
  render() {
    const { location_city, location_state, email, classes } = this.props;
    return (
      <Paper style={{ marginTop: "5px", padding: "20px 0px 15px 0px" }}>
        <div style={{ marginLeft: "45px" }}>
          <Typography variant="subtitle2">Settings</Typography>
          <Typography
            variant="body1"
            inline
            className={classes.textLabels}
            component={Link}
            to="/changePassword"
          >
            Change Password
          </Typography>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(settingsCard);
