import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import Backdrop from "@material-ui/core/Backdrop";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Typography } from "@material-ui/core";

const styles = (theme) => ({
  ...theme.spreadThis,
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
});

class success extends Component {
  render() {
    const { classes, open, body } = this.props;

    return (
      <div>
        <Link to="/userDashboard">
          <Backdrop className={classes.backdrop} open={open}>
            <Paper
              style={{ width: 700, padding: "40px 20px 40px 20px" }}
              elevation={3}
            >
              <Grid container alignItems="center">
                <Grid item md={3}>
                  <CheckCircleIcon
                    color="secondary"
                    style={{ fontSize: 150 }}
                  />
                </Grid>
                <Grid item md={9}>
                  {body}
                </Grid>
              </Grid>
            </Paper>
          </Backdrop>
        </Link>
      </div>
    );
  }
}

export default withStyles(styles)(success);
