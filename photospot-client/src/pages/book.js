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
import { dateConvert, timeConvert } from "../util/UtilFunctions";
import ProfileCard from "../components/booking/card";
import Pricing from "../components/photographer-page/Pricing";
import { Typography } from "@material-ui/core";
import GoBackButton from "../components/shared/Buttons/GoBackButton";

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
      pricing: null,
      selectedShootName: null,
      selectedShootPrice: null,
      pricingMap: null,
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
      selectedShoot: {
        name: this.state.selectedShootName,
        price: this.state.selectedShootPrice,
      },
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

  handleSelect = (shootType) => {
    this.setState({
      selectedShootName: shootType[0],
      selectedShootPrice: shootType[1],
    });
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
        <div
          style={{
            maxWidth: halfScreen ? (fullScreen ? 425 : 550) : 900,
            margin: "0 auto",
          }}
        >
          <Grid container direction="row" justify="center" spacing={2}>
            <Grid item xs={12} style={{ width: "100%" }}>
              <Typography>Select a shoot type</Typography>
              {loadingData ? (
                <CircularProgress
                  className={classes.progress}
                  color="secondary"
                />
              ) : (
                <Pricing
                  pricing={this.state.pricingMap}
                  fullScreen={fullScreen}
                  handleSelect={(selected) => this.handleSelect(selected)}
                  selectable={true}
                />
              )}
            </Grid>
          </Grid>

          {this.state.selectedShootName && (
            <Paper
              style={{
                padding: 15,
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
                        type={this.state.selectedShootName}
                        price={this.state.selectedShootPrice}
                      />
                    ) : (
                      <ProfileCard
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                        profileImage={this.state.profileImage}
                        location_city={this.state.location_city}
                        location_state={this.state.location_state}
                        type={this.state.selectedShootName}
                        price={this.state.selectedShootPrice}
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
                      type={this.state.selectedShootName}
                      price={this.state.selectedShootPrice}
                    />
                  )}
                </Grid>
                <Grid item md={5} sm={8} xs={12} style={{ width: "100%" }}>
                  <Date
                    theDate={this.state.selectedDate}
                    allDates={this.state.availability}
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
          )}
        </div>
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
  checkBookability,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(book));
