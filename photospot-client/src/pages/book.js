import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Redirect } from "react-router-dom";

// MUI
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

// Redux
import { connect } from "react-redux";
import {
  getPhotographerPage,
  getBookingTimes,
  bookPhotographer,
  checkBookability,
} from "../redux/actions/dataActions";

// Components
import MiniPhotographer from "../components/shared/miniPhotographer";
import Date from "../components/booking/date";
import equal from "fast-deep-equal";
import Time from "../components/booking/time";
import Confirmation from "../components/shared/confirmation";

// Date format
import moment from "moment";
import { timeConvert } from "../util/timeConvert";
import { dateConvert } from "../util/dateConvert";
import ProfileCard from "../components/booking/card";
import GoBackButton from "../components/shared/goBackButton";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class book extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      bio: "",
      profileImage: "",
      images: [],
      ratePerHour: 0,
      selectedDate: new Date(),
      formattedDate: "",
      availability: [],
      timeslots: [],
      selectedTime: null,
      open: false,
      openSnack: false,
      reviewCount: null,
      totalRating: null,
    };
  }

  verifyID(details, id) {
    details.forEach((task) =>
      Object.entries(task).forEach(([key, value]) => {
        if (key === "photographerID" && value === id) {
          console.log("true");
          return true;
        } else {
          console.log("false");
          return false;
        }
      })
    );
  }

  assignStates = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  assignValues(details) {
    const photoDetails = Object.values(details);

    photoDetails.forEach((task) =>
      Object.entries(task).forEach(([key, value]) => {
        this.assignStates(key, value);
      })
    );
  }

  assignTimes(times) {
    this.setState({
      availability: times,
    });
  }

  componentDidMount() {
    const photographerID = this.props.match.params.photographerID;
    this.props.getPhotographerPage(photographerID);
    this.props.getBookingTimes(photographerID);
    const photoDetails = this.props.photographerDetails;
    const bookTimings = this.props.timings;
    this.assignTimes(bookTimings);
    this.assignValues(photoDetails);
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.photographerDetails, prevProps.photographerDetails)) {
      this.assignValues(this.props.photographerDetails);
    }
    if (!equal(this.props.timings, prevProps.timings)) {
      this.assignTimes(this.props.timings);
    }
  }

  // When date changes, change the selected date and find all time slots for that date
  handleDateChange = (date) => {
    this.setState({
      selectedDate: date,
      formattedDate: moment(date).format("MM-DD-YYYY"),
      selectedTime: null,
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

  handleSubmit = (value) => {
    this.props.checkBookability().then((response) => {
      if (response) {
        this.setState({ selectedTime: value });
        this.handleClickOpen();
      } else {
        this.setState({
          openSnack: true,
        });
      }
    });
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleDisagree = () => {
    this.setState({
      open: false,
    });
  };

  handleAgree = () => {
    let bookingDetails = {
      photographerID: this.props.match.params.photographerID,
      photographerEmail: this.state.email,
      date: this.state.formattedDate,
      time: this.state.selectedTime,
      photographerFirstName: this.state.firstName,
      photographerLastName: this.state.lastName,
      photographerProfileImage: this.state.profileImage,
      photographerThumbnailImage: this.state.thumbnailImage,
      ratePerHour: this.state.ratePerHour,
    };

    this.props.history.push({
      pathname: `${this.props.history.location.pathname}/checkout`,
      details: bookingDetails,
    });
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ openSnack: false });
  };

  render() {
    if (this.props.user.credentials) {
      if (this.props.user.credentials[0]?.photographer) {
        console.log("you are a photographer");
        return <Redirect to="/" />;
      }
    }
    const {
      classes,
      UI: { loadingAction, errors, loadingData },
      halfScreen,
      fullScreen,
    } = this.props;
    return (
      <>
        <GoBackButton {...this.props} />
        <Paper
          style={{
            padding: 15,
            maxWidth: halfScreen ? (fullScreen ? 350 : 550) : 900,
            margin: "0 auto",
          }}
        >
          <Grid container direction="row" justify="center" spacing={2}>
            <Snackbar
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              open={this.state.openSnack}
              onClose={this.handleClose}
            >
              <Alert onClose={this.handleClose} severity={"warning"}>
                You already have a pending order.
              </Alert>
            </Snackbar>

            <Grid item md={4} sm={12} style={{ width: "100%" }}>
              {halfScreen ? (
                fullScreen ? (
                  <MiniPhotographer
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    profileImage={this.state.profileImage}
                    location_city={this.state.location_city}
                    location_state={this.state.location_state}
                    price={this.state.ratePerHour}
                  />
                ) : (
                  <ProfileCard
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    profileImage={this.state.profileImage}
                    location_city={this.state.location_city}
                    location_state={this.state.location_state}
                    price={this.state.ratePerHour}
                  />
                )
              ) : (
                <MiniPhotographer
                  firstName={this.state.firstName}
                  lastName={this.state.lastName}
                  profileImage={this.state.profileImage}
                  location_city={this.state.location_city}
                  location_state={this.state.location_state}
                  price={this.state.ratePerHour}
                />
              )}
            </Grid>
            <Grid item md={5} sm={8} xs={12} style={{ width: "100%" }}>
              <Date
                theDate={this.state.selectedDate}
                parentCallback={this.handleDateChange}
                fullScreen={fullScreen}
              />
            </Grid>

            <Grid item md={3} sm={4} xs={12} style={{ width: "100%" }}>
              {loadingData ? (
                <CircularProgress
                  className={classes.progress}
                  color="secondary"
                />
              ) : (
                <Time
                  {...this.props}
                  key={this.state.timeslots}
                  authenticated={this.props.user.authenticated}
                  timeslots={this.state.timeslots}
                  handleSubmit={(time) => this.handleSubmit(time)}
                  theDate={this.state.selectedDate}
                />
              )}
            </Grid>

            <Confirmation
              open={this.state.open}
              secondaryConfirmation={false}
              handleAgree={this.handleAgree}
              handleDisagree={this.handleDisagree}
              title="Confirm Booking"
              text={`Would you like to confirm booking with ${
                this.state.firstName
              }
          ${this.state.lastName} on ${dateConvert(this.state.formattedDate)} at 
          ${timeConvert(this.state.selectedTime)}?`}
            />
          </Grid>
        </Paper>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  photographerDetails: state.data.photographerPage,
  timings: state.data.timings,
  UI: state.UI,
  user: state.user,
});

const mapActionsToProps = {
  getPhotographerPage,
  getBookingTimes,
  bookPhotographer,
  checkBookability,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(book));
