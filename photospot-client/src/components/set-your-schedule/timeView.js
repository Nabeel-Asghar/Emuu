import React, { Component } from "react";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Radio from "@material-ui/core/Radio";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";

// util
import arraySort from "array-sort";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class timeView extends Component {
  removeFromArray(arr, value) {
    var i = 0;
    while (i < arr.length) {
      if (arr[i] === value) {
        arr.splice(i, 1);
      } else {
        ++i;
      }
    }
    return arr;
  }

  render() {
    const { classes, timeslots } = this.props;

    let displayTimeslots = [];
    let unAccountedFor = [];
    let sortedTimeslots = [];
    let combinedArray = [];
    let allPossibleTimes = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    if (timeslots && timeslots.length) {
      Object.entries(timeslots[0]).map(([key, value]) => {
        let timeValue;
        let label;
        let time = parseInt(key.substring(0, 2), 10);
        allPossibleTimes = this.removeFromArray(allPossibleTimes, time);
        console.log("key: ", time);
        if (time < 10) {
          timeValue = "0" + `${time}` + ":00";
          label = `${time}` + ":00 AM";
          time = time - 10;
        }
        if (time < 12 && time > 9) {
          timeValue = `${time}` + ":00";
          label = `${time}` + ":00 AM";
        }
        if (time === 12) {
          timeValue = `${time}` + ":00";
          label = `${time}` + ":00 PM";
        }
        if (time > 12) {
          timeValue = `${time}` + ":00";
          label = `${time - 12}` + ":00 PM";
        }
        displayTimeslots.push(
          <FormControlLabel
            disabled={value}
            checked={true}
            value={timeValue}
            control={<Checkbox />}
            label={label}
            key={time}
            style={{ width: "120px" }}
          />
        );
      });
    }

    for (var i = 0; i < allPossibleTimes.length; i++) {
      let value;
      let label;
      let time = allPossibleTimes[i];
      console.log("key: ", time);
      if (time < 10) {
        value = "0" + `${time}` + ":00";
        label = `${time}` + ":00 AM";
        time = time - 10;
      }
      if (time < 12 && time > 9) {
        value = `${time}` + ":00";
        label = `${time}` + ":00 AM";
      }
      if (time === 12) {
        value = `${time}` + ":00";
        label = `${time}` + ":00 PM";
      }
      if (time > 12) {
        value = `${time}` + ":00";
        label = `${time - 12}` + ":00 PM";
      }
      unAccountedFor.push(
        <FormControlLabel
          checked={false}
          value={value}
          control={<Checkbox />}
          label={label}
          key={time}
          style={{ width: "120px" }}
        />
      );
    }

    combinedArray = displayTimeslots.concat(unAccountedFor);
    sortedTimeslots = arraySort(combinedArray, ["key", "props.value"]);
    console.log(sortedTimeslots);

    return (
      <form onSubmit={this.props.handleSubmit}>
        <FormControl
          component="fieldset"
          className={classes.form}
          color="secondary"
        >
          <FormLabel component="legend" style={{ color: "black" }}>
            Choose timeslots that you are available at
          </FormLabel>
          <FormGroup>
            <Grid container>
              <Grid item xs={4}>
                {sortedTimeslots.slice(0, 4)}
              </Grid>
              <Grid item xs={4}>
                {sortedTimeslots.slice(4, 8)}
              </Grid>
              <Grid item xs={4}>
                {sortedTimeslots.slice(8, 12)}
              </Grid>
              <Grid item xs={12} style={{ marginTop: "20px" }}>
                <FormControlLabel
                  checked={true}
                  control={<Checkbox />}
                  label={"You are available"}
                  style={{ width: "120px" }}
                />
                <FormControlLabel
                  disabled={true}
                  checked={true}
                  control={<Checkbox />}
                  label={"You are booked"}
                  style={{ width: "120px" }}
                />
              </Grid>
            </Grid>
          </FormGroup>
        </FormControl>
      </form>
    );
  }
}

export default withStyles(styles)(timeView);
