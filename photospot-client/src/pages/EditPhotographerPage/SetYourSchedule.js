import React, { Component } from "react";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

// Components
import DateView from "../../components/SetSchedule/DateView";
import TimeView from "../../components/SetSchedule/TimeView";
import GoBackButton from "../../components/Shared/Buttons/GoBackButton";

// Redux
import { connect } from "react-redux";
import { getBookingTimes } from "../../redux/actions/dataActions";
import { getUserData, editBookingTimes } from "../../redux/actions/userActions";

// Date format
import moment from "moment";
import equal from "fast-deep-equal";
import Confirmation from "../../components/Shared/Confirmation";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class SetYourSchedule extends Component {
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
      changed: false,
      openConfirmation: false,
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
    this.setState(
      {
        availability: times,
      },
      () => this.handleDateChange(new Date())
    );
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
    this.setState({ changed: true });
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
    this.setState({
      openConfirmation: false,
      changed: false,
      changedDate: null,
    });
    var formatedTimeslots = [];
    var formattedDict = {};

    for (var i = 0; i < this.state.checkedSlots.length; i++) {
      var date = this.convertTimeToString(this.state.checkedSlots[i]);
      var timeSlot = { [date]: false };
      formatedTimeslots.push(timeSlot);
      formattedDict[[date]] = false;

      // let momentDate = moment
      //   .utc(this.state.formattedDate + " " + date)
      //   .format("MM-DD-YYYY-HH");
      // algoliaDates.push(momentDate);
    }

    var algoliaDates = moment
      .utc(this.state.formattedDate + " " + date)
      .format("MM-DD-YYYY");

    for (var i = 0; i < this.state.disabledCheckSlots.length; i++) {
      var date = this.convertTimeToString(this.state.disabledCheckSlots[i]);
      var timeSlot = { [date]: true };
      formattedDict[[date]] = true;
    }

    var dayAndTime = {
      date: this.state.formattedDate,
      time: formattedDict,
      algoliaDates: algoliaDates,
    };

    this.props.editBookingTimes(dayAndTime).then(() => {
      this.setState({ open: true });
    });

    console.log(formatedTimeslots);
    console.log(formattedDict);
    console.log(algoliaDates);
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
    if (this.state.changed) {
      this.setState({ openConfirmation: true, changedDate: date });
      return;
    }
    this.setState({
      selectedDate: date,
      formattedDate: moment(date).format("MM-DD-YYYY"),
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
      this.resetChecked();
    }
  };

  handleDisagree = () => {
    this.setState({
      openConfirmation: false,
    });
  };

  handleAgree = () => {
    this.setState(
      {
        openConfirmation: false,
        changed: false,
      },
      () => this.handleDateChange(this.state.changedDate)
    );
  };

  render() {
    const {
      classes,
      UI: { loadingAction, generalError, loadingData },
      fullScreen,
    } = this.props;

    console.log(this.state.timeslots);

    return (
      <div>
        <GoBackButton {...this.props} />
        <Grid
          container
          spacing={1}
          justify="center"
          className={classes.mediumPaperContainer}
        >
          <Confirmation
            {...this.props}
            open={this.state.openConfirmation}
            title={"Save unsaved changes?"}
            text={
              "You have unsaved changed. You must submit for each day. We know this is annoying and are working on fixing this."
            }
            handleDisagree={this.handleDisagree}
            disagreeText={"Cancel"}
            handleAgree={this.handleAgree}
            agreeText={"Continue"}
          />
          <Grid item md={6} sm={12} className={classes.dateContainer}>
            <DateView
              selectedDate={this.state.selectedDate}
              handleDateChange={this.handleDateChange}
              fullScreen={fullScreen}
            />
          </Grid>
          <Grid item md={6} sm={12} className={classes.timeContainer}>
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
          <Grid item xs={12}>
            <div
              className={classes.root}
              style={{ marginTop: "10px", textAlign: "center" }}
            >
              <Button
                variant="outlined"
                disabled={loadingAction}
                color="secondary"
                onClick={() => {
                  this.resetChecked();
                }}
                className={classes.spacedButton}
                size="large"
              >
                Reset
              </Button>
              <Button
                variant="contained"
                disabled={loadingAction}
                color="secondary"
                onClick={() => this.handleSubmit()}
                className={classes.spacedButton}
                size="large"
              >
                Submit
                {loadingAction && (
                  <CircularProgress
                    className={classes.progress}
                    color="secondary"
                  />
                )}
              </Button>
            </div>
          </Grid>
        </Grid>
      </div>
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
)(withStyles(styles)(SetYourSchedule));
