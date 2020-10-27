import React, { Component } from "react";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

// Components
import DateView from "../components/set-your-schedule/dateView";
import TimeView from "../components/set-your-schedule/timeView";

// Redux
import { connect } from "react-redux";
import { getBookingTimes } from "../redux/actions/dataActions";
import { getUserData, editBookingTimes } from "../redux/actions/userActions";

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
      formattedDate: moment(new Date()).format("MM-DD-YYYY"),
      availability: [],
      timeslots: [],
      checkedSlots: [],
      disabledCheckSlots: [],
      open: false,
    };
    this.baseChecks = this.state.checkedSlots;
    this.baseDisabled = this.state.disabledCheckSlots;
  }

  componentDidMount() {
    this.props.getUserData().then(() => {
      let photographerID = this.props.photographerID.userID;
      this.props.getBookingTimes(photographerID);
      const bookTimings = this.props.timings;
      this.assignTimes(bookTimings);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!equal(this.props.timings, prevProps.timings)) {
      this.assignTimes(this.props.timings);
    }
    if (!equal(this.state.timeslots, prevState.timeslots)) {
      this.resetState();
      this.extractTimeSlots();
    }
  }

  assignTimes(times) {
    this.setState({
      availability: times,
    });
  }

  resetState() {
    this.setState({ checkedSlots: this.baseChecks });
    this.setState({ disabledCheckSlots: this.baseDisabled });
    return true;
  }

  resetChecked = () => {
    this.setState({ checkedSlots: this.baseChecks });
  };

  handleChange = (event) => {
    let value = parseInt(event.target.value.substring(0, 2), 10);

    if (!this.state.checkedSlots.includes(value)) {
      this.setState((prevState) => ({
        checkedSlots: [...prevState.checkedSlots, value],
      }));
    } else {
      var array = [...this.state.checkedSlots]; // make a separate copy of the array
      var index = array.indexOf(value);
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({ checkedSlots: array });
      }
    }
  };

  convertTimeToString = (time) => {
    var date = "";
    if (time < 10) {
      date = `0${time}:00`;
    } else {
      date = `${time}:00`;
    }
    return date;
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ open: false });
  };

  handleSubmit = () => {
    var formatedTimeslots = [];
    var formattedDict = {};
    var algoliaDates = [];


    

    for (var i = 0; i < this.state.checkedSlots.length; i++) {
      var date = this.convertTimeToString(this.state.checkedSlots[i]);
      var timeSlot = { [date]: false };
      formatedTimeslots.push(timeSlot);
      formattedDict[[date]] = false;

      let momentDate = moment.utc(this.state.formattedDate + " " + date).format();
      algoliaDates.push(momentDate);
    }

    for (var i = 0; i < this.state.disabledCheckSlots.length; i++) {
      var date = this.convertTimeToString(this.state.disabledCheckSlots[i]);
      var timeSlot = { [date]: true };
      formattedDict[[date]] = true;
    }

    var dayAndTime = { date: this.state.formattedDate, time: formattedDict , algoliaDates: algoliaDates};

    this.props.editBookingTimes(dayAndTime).then(() => {
      this.setState({ open: true });
    });
  };

  extractTimeSlots() {
    if (this.state.timeslots && this.state.timeslots.length) {
      Object.entries(this.state.timeslots[0]).map(async ([key, value]) => {
        let time = parseInt(key.substring(0, 2), 10);

        if (value) {
          this.setState((prevState) => ({
            disabledCheckSlots: [...prevState.disabledCheckSlots, time],
          }));
        } else {
          this.setState((prevState) => ({
            checkedSlots: [...prevState.checkedSlots, time],
          }));
        }
      });
    }
  }

  handleDateChange = (date) => {
    this.setState({
      selectedDate: date,
      formattedDate: moment(date).format("MM-DD-YYYY"),
    });

    console.log(moment(date).format("MM-DD-YYYY"));

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
      this.resetChecked();
    }
  };

  render() {
    const {
      classes,
      UI: { loadingAction, generalError, loadingData },
    } = this.props;

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
            {loadingData ? (
              <CircularProgress
                className={classes.progress}
                color="secondary"
              />
            ) : (
              <TimeView
                date={this.state.formattedDate}
                checked={this.state.checkedSlots}
                disabled={this.state.disabledCheckSlots}
                reset={this.resetChecked}
                submit={this.handleSubmit}
                handleChange={this.handleChange}
                loading={loadingAction}
                open={this.state.open}
                error={generalError}
                handleClose={this.handleClose}
              />
            )}
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  timings: state.data.timings,
  photographerID: state.user.credentials[0],
  UI: state.UI,
});

const mapActionsToProps = {
  getBookingTimes,
  getUserData,
  editBookingTimes,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(setYourSchedule));
