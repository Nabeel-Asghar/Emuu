import React, { Component } from "react";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class time extends Component {
  state = {
    selectedTime: null,
  };

  componentDidUpdate(prevProps) {
    if (this.props.theDate !== prevProps.theDate) {
      this.setState({
        selectedTime: null,
      });
    }
  }

  handleRadioChange = (value) => {
    console.log(value);
    this.setState({
      selectedTime: value,
    });
  };

  render() {
    const { classes, timeslots } = this.props;

    let timesAvailable = [];
    let displayTimeslots = [];
    let allTimes = [
      { value: "09:00", label: "09:00 AM - 10:00 AM" },
      { value: "10:00", label: "10:00 AM - 11:00 AM" },
      { value: "11:00", label: "11:00 AM - 12:00 PM" },
      { value: "12:00", label: "12:00 PM - 1:00 PM" },
      { value: "13:00", label: "1:00 PM - 2:00 PM" },
      { value: "14:00", label: "2:00 PM - 3:00 PM" },
      { value: "15:00", label: "3:00 PM - 4:00 PM" },
      { value: "16:00", label: "4:00 PM - 5:00 PM" },
      { value: "17:00", label: "5:00 PM - 6:00 PM" },
      { value: "18:00", label: "6:00 PM - 7:00 PM" },
      { value: "19:00", label: "7:00 PM - 8:00 PM" },
      { value: "20:00", label: "8:00 PM - 9:00 PM" },
      { value: "21:00", label: "9:00 PM - 10:00 PM" },
      { value: "22:00", label: "10:00 PM - 11:00 PM" },
    ];

    if (timeslots && timeslots.length) {
      Object.entries(timeslots[0]).map(([key, value]) => {
        // false = not booked at that timeslots
        // true  = booked at that timeslot
        if (!value) {
          timesAvailable.push(key);
        }
      });

      allTimes.map((item, index) => {
        if (timesAvailable.includes(item.value)) {
          displayTimeslots.push(
            <>
              <Button
                value={item.value}
                onClick={() => this.handleRadioChange(item.value)}
                variant={
                  this.state.selectedTime === item.value
                    ? "contained"
                    : "outlined"
                }
                color="secondary"
                fullWidth
                style={{ margin: "5px 0" }}
                key={9}
              >
                {item.label}
              </Button>
            </>
          );
        }
      });
    }

    return (
      <div>
        {displayTimeslots.length > 0 ? (
          <>
            <Typography gutterBottom>Pick a time for your shoot</Typography>
            {displayTimeslots}
            {this.props.authenticated ? (
              this.state.selectedTime && (
                <Button
                  onClick={() =>
                    this.props.handleSubmit(this.state.selectedTime)
                  }
                  fullWidth
                  variant="contained"
                  color="secondary"
                  style={{ marginTop: "15px" }}
                >
                  Submit
                </Button>
              )
            ) : (
              <Button
                onClick={() => this.props.history.push("/login")}
                fullWidth
                variant="contained"
                color="secondary"
                style={{ marginTop: "15px" }}
              >
                Submit
              </Button>
            )}
          </>
        ) : (
          <Typography
            style={{
              textAlign: "center",
              paddingBottom: "10px",
            }}
          >
            No timeslots that day
          </Typography>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(time);