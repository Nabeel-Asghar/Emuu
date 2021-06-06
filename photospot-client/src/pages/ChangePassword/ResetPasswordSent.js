// MUI
import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import AppIcon from "../../images/logo.png";

const styles = (theme) => ({
  ...theme.spreadThis,
  logoImage: {
    borderRadius: "50%",
    marginTop: "30px",
  },
});

class resetPasswordSent extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Grid container className={classes.form}>
        <Grid item xs />
        <Paper
          style={{
            width: "480px",
            margin: "auto",
            paddingBottom: "25px",
            paddingTop: "25px",
            marginTop: 100,
          }}
        >
          <Grid item xs={7} style={{ margin: "auto" }}>
            <Typography variant="h6" className={classes.pageTitle}>
              Link to reset password has been sent to your email.
            </Typography>
          </Grid>
        </Paper>
        <Grid item xs />
      </Grid>
    );
  }
}

export default withStyles(styles)(resetPasswordSent);
