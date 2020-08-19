import React, { Component } from "react";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class time extends Component {
  render() {
    const { classes, timeslots } = this.props;

    let timesAvailable = [];
    let displayTimeslots = [];

    if (timeslots && timeslots.length) {
      Object.entries(timeslots[0]).map(([key, value]) => {
        // false = not booked at that timeslots
        // true  = booked at that timeslot
        if (!value) {
          timesAvailable.push(key);
        }
      });

      if (timesAvailable.includes("09:00")) {
        displayTimeslots.push(
          <FormControlLabel
            value="09:00"
            control={<Radio />}
            label="9:00 AM"
            key={9}
          />
        );
      }

      if (timesAvailable.includes("10:00")) {
        displayTimeslots.push(
          <FormControlLabel
            value="10:00"
            control={<Radio />}
            label="10:00 AM"
            key={10}
          />
        );
      }

      if (timesAvailable.includes("11:00")) {
        displayTimeslots.push(
          <FormControlLabel
            value="11:00"
            control={<Radio />}
            label="11:00 AM"
            key={11}
          />
        );
      }

      if (timesAvailable.includes("12:00")) {
        displayTimeslots.push(
          <FormControlLabel
            value="12:00"
            control={<Radio />}
            label="12:00 PM"
            key={12}
          />
        );
      }

      if (timesAvailable.includes("13:00")) {
        displayTimeslots.push(
          <FormControlLabel
            value="13:00"
            control={<Radio />}
            label="1:00 PM"
            key={13}
          />
        );
      }

      if (timesAvailable.includes("14:00")) {
        displayTimeslots.push(
          <FormControlLabel
            value="14:00"
            control={<Radio />}
            label="2:00 PM"
            key={14}
          />
        );
      }

      if (timesAvailable.includes("15:00")) {
        displayTimeslots.push(
          <FormControlLabel
            value="15:00"
            control={<Radio />}
            label="3:00 PM"
            key={15}
          />
        );
      }

      if (timesAvailable.includes("16:00")) {
        displayTimeslots.push(
          <FormControlLabel
            value="16:00"
            control={<Radio />}
            label="4:00 PM"
            key={16}
          />
        );
      }

      if (timesAvailable.includes("17:00")) {
        displayTimeslots.push(
          <FormControlLabel
            value="17:00"
            control={<Radio />}
            label="5:00 PM"
            key={17}
          />
        );
      }
    }

    return (
      <form
        onSubmit={this.props.handleSubmit}
        style={{ paddingLeft: "10px", paddingTop: "15px" }}
      >
        <FormControl component="fieldset" className={classes.form}>
          <FormLabel
            color="secondary"
            component="legend"
            style={{
              textAlign: "center",
              paddingBottom: "10px",
            }}
          >
            Choose a time for your shoot
          </FormLabel>
          <RadioGroup
            aria-label="Shoot time"
            name="scheduletime"
            value={this.props.selectedTime}
            onChange={this.props.handleRadioChange}
          >
            {displayTimeslots}
          </RadioGroup>
          <Button
            type="submit"
            variant="outlined"
            color="secondary"
            style={{ marginTop: "15px" }}
          >
            Submit
          </Button>
        </FormControl>
      </form>
    );
  }
}

export default withStyles(styles)(time);
