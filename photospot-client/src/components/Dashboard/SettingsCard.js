import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
// Material UI
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class settingsCard extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.cardStyle}>
        <div className={classes.interiorCard}>
          <Typography variant="subtitle2">SETTINGS</Typography>
          <Typography
            variant="body1"
            inline
            className={classes.textStyle}
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
