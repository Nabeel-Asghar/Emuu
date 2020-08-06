import React, { Component } from "react";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

// Components
import DateView from "../components/set-your-schedule/dateView";
import TimeView from "../components/set-your-schedule/timeView";

// Redux
import { connect } from "react-redux";
import { getBookingTimes } from "../redux/actions/dataActions";
import { getUserData } from "../redux/actions/userActions";

// Date format
import moment from "moment";
import equal from "fast-deep-equal";

const styles = (theme) => ({
  ...theme.spreadThis,
});

export class setYourSchedule extends Component {
  constructor() {
    super();
    this.state = {
      selectedDate: new Date(),
      formattedDate: "",
      availability: [],
      timeslots: [],
    };
  }

  componentDidMount() {
    this.props.getUserData().then(() => {
      let photographerID = this.props.photographerID.userID;
      this.props.getBookingTimes(photographerID);
      const bookTimings = this.props.timings;
      this.assignTimes(bookTimings);
    });
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.timings, prevProps.timings)) {
      this.assignTimes(this.props.timings);
    }
  }

  assignTimes(times) {
    this.setState({
      availability: times,
    });
  }

  handleDateChange = (date) => {
    this.setState({
      selectedDate: date,
      formattedDate: moment(date).format("MM-D-YYYY"),
    });

    let found = false;

    // Iterate through all given timeslots on all dates to find the selected date slots
    const arrayOfTimeSlots = Object.values(this.state.availability);

    arrayOfTimeSlots.forEach((task) =>
      Object.entries(task).forEach(([key, value]) => {
        if (key === moment(date).format("MM-DD-YYYY")) {
          this.setState({
            timeslots: [value],
          });
          found = true;
        }
      })
    );

    if (!found) {
      this.setState({
        timeslots: null,
      });
    }
  };

  render() {
    return (
      <Paper style={{ paddingTop: "20px" }}>
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <DateView
              selectedDate={this.state.selectedDate}
              handleDateChange={this.handleDateChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TimeView timeslots={this.state.timeslots} />
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  timings: state.data.timings,
  photographerID: state.user.credentials[0],
});

const mapActionsToProps = {
  getBookingTimes,
  getUserData,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(setYourSchedule));
