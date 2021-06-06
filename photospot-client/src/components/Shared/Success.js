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
import Fab from "@material-ui/core/Fab";

const styles = (theme) => ({
  ...theme.spreadThis,
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
});

class success extends Component {
  render() {
    const { classes, open, headline, body, redirect, reload } = this.props;

    return (
      <div>
        <Backdrop className={classes.backdrop} open={open}>
          <Paper style={{ width: 275, padding: "20px 20px" }} elevation={3}>
            <Grid container alignItems="center">
              <Grid item xs={12} className={classes.centerGrid}>
                <Fab
                  color="primary"
                  disableFocusRipple
                  disableRipple
                  style={{
                    width: 120,
                    height: 120,
                    marginTop: -75,
                    pointerEvents: "none",
                  }}
                >
                  <CheckCircleIcon
                    color="secondary"
                    style={{
                      fontSize: 150,
                    }}
                  />
                </Fab>
              </Grid>
              <Grid
                item
                xs={12}
                className={classes.centerGrid}
                style={{ paddingTop: "10px" }}
              >
                <Typography variant="h5" gutterBottom>
                  {headline}
                </Typography>
                {body}
              </Grid>
              <Grid item xs={12} style={{ marginTop: "15px" }}>
                {reload ? (
                  <Button
                    onClick={() => window.location.reload()}
                    color="secondary"
                    variant="contained"
                    fullWidth
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    component={Link}
                    to={redirect}
                    color="secondary"
                    variant="outlined"
                    fullWidth
                  >
                    Continue
                  </Button>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Backdrop>
      </div>
    );
  }
}

export default withStyles(styles)(success);
