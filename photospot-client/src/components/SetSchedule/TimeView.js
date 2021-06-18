import React, { Component } from "react";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

// Components
import RadioLegend from "./RadioLegend";

// util
import equal from "fast-deep-equal";
import SnackbarAlert from "../Shared/SnackbarAlert";

const styles = (theme) => ({
  ...theme.spreadThis,
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
});

class timeView extends Component {
  componentDidUpdate(prevProps) {
    if (!equal(this.props.checked, prevProps.checked)) {
      this.forceUpdate();
    }
  }

  render() {
    const { classes, checked, disabled, open, error } = this.props;

    const timings1 = [
      { name: "09:00", value: 9, label: "9:00 AM" },
      { name: "10:00", value: 10, label: "10:00 AM" },
      { name: "11:00", value: 11, label: "11:00 AM" },
      { name: "12:00", value: 12, label: "12:00 PM" },
      { name: "13:00", value: 13, label: "1:00 PM" },
      { name: "14:00", value: 14, label: "2:00 PM" },
    ];

    const timings2 = [
      { name: "15:00", value: 15, label: "3:00 PM" },
      { name: "16:00", value: 16, label: "4:00 PM" },
      { name: "17:00", value: 17, label: "5:00 PM" },
      { name: "18:00", value: 18, label: "6:00 PM" },
      { name: "19:00", value: 19, label: "7:00 PM" },
      { name: "20:00", value: 20, label: "8:00 PM" },
    ];

    // open={this.state.open}
    //           error={generalError}
    //           handleClose={this.handleClose}

    return (
      <form onSubmit={this.props.handleSubmit} style={{ width: "100%" }}>
        <SnackbarAlert
          open={open}
          severity={error ? "warning" : "success"}
          handleClose={this.props.handleClose}
          message={error ? "Something went wrong" : "Success!"}
          duration={4000}
        />
        <FormControl
          component="fieldset"
          style={{ margin: "0 auto", width: "100%" }}
          color="secondary"
        >
          <FormLabel
            component="legend"
            style={{
              textAlign: "center",
              color: "black",
              padding: "15px 0 15px 0",
            }}
          >
            Choose timeslots that you are available at
          </FormLabel>
          <FormGroup>
            <Grid container>
              <Grid item xs={6}>
                {timings1.map((timeslot) => {
                  return (
                    <FormControlLabel
                      disabled={
                        disabled.includes(timeslot.value) ? true : false
                      }
                      control={
                        <Checkbox
                          checked={
                            checked.includes(timeslot.value) ? true : false
                          }
                          onChange={this.props.handleChange}
                          name={timeslot.name}
                          color="secondary"
                          value={timeslot.value}
                        />
                      }
                      label={timeslot.label}
                      key={timeslot.value}
                      className={classes.timeslots}
                    />
                  );
                })}
              </Grid>

              <Grid item xs={6}>
                {timings2.map((timeslot) => {
                  return (
                    <FormControlLabel
                      disabled={
                        disabled.includes(timeslot.value) ? true : false
                      }
                      control={
                        <Checkbox
                          checked={
                            checked.includes(timeslot.value) ? true : false
                          }
                          onChange={this.props.handleChange}
                          name={timeslot.name}
                          color="secondary"
                          value={timeslot.value}
                        />
                      }
                      label={timeslot.label}
                      key={timeslot.value}
                      className={classes.timeslots}
                    />
                  );
                })}
              </Grid>

              <Grid
                item
                xs={12}
                style={{ marginTop: "20px", textAlign: "center" }}
              >
                <RadioLegend />
              </Grid>
            </Grid>
          </FormGroup>
        </FormControl>
      </form>
    );
  }
}

export default withStyles(styles)(timeView);
