import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

// MUI
import Grid from "@material-ui/core/Grid";

// Redux
import { connect } from "react-redux";
import {
  getPhotographerPage,
  getBookingTimes,
  bookPhotographer,
} from "../redux/actions/dataActions";

// Components
import ProfileCard from "../components/booking/card";
import Date from "../components/booking/date";
import equal from "fast-deep-equal";
import Time from "../components/booking/time";
import Confirmbook from "../components/booking/confirmbook";

// Date format
import moment from "moment";

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
      formattedDate: moment(date).format("MM-D-YYYY"),
    });

    let found = false;

    // Iterate through all given timeslots on all dates to find the selected date slots
    const arrayOfTimeSlots = Object.values(this.state.availability);

    arrayOfTimeSlots.forEach((task) =>
      Object.entries(task).forEach(([key, value]) => {
        if (key === moment(date).format("MM-D-YYYY")) {
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

  handleRadioChange = (event) => {
    this.setState({
      selectedTime: event.target.value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.handleClickOpen();
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
      date: this.state.formattedDate,
      time: this.state.selectedTime,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      profileImage: this.state.profileImage,
    };
    this.props.bookPhotographer(
      this.props.match.params.photographerID,
      bookingDetails
    );

    console.log("Booked!");

    this.setState({
      open: false,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container spacing={3}>
        <Grid item xs={2} />
        <Grid item xs={8}>
          <ProfileCard
            key={this.state.photographerID}
            photographerID={this.state.photographerID}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            profileImage={this.state.profileImage}
          />
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={2} />
        <Grid item xs={5}>
          <Date
            theDate={this.state.selectedDate}
            parentCallback={this.handleDateChange}
          />
        </Grid>
        <Grid item xs={3}>
          <Time
            key={this.state.timeslots}
            timeslots={this.state.timeslots}
            handleSubmit={this.handleSubmit}
            handleRadioChange={this.handleRadioChange}
            time={this.state.selectedTime}
          />
        </Grid>
        <Confirmbook
          open={this.state.open}
          handleAgree={this.handleAgree}
          handleDisagree={this.handleDisagree}
          firstName={this.state.firstName}
          lastName={this.state.lastName}
          date={moment(this.state.formattedDate).format("dddd, MMMM Do")}
          time={this.state.selectedTime}
        />

        <Grid item xs={2}></Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  photographerDetails: state.data.photographerPage,
  timings: state.data.timings,
});

const mapActionsToProps = {
  getPhotographerPage,
  getBookingTimes,
  bookPhotographer,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(book));
