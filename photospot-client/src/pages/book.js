import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

// MUI
import Grid from "@material-ui/core/Grid";

// Redux
import { connect } from "react-redux";
import { getPhotographerPage } from "../redux/actions/dataActions";

// Components
import Card from "../components/booking/card";
import Date from "../components/booking/date";
import equal from "fast-deep-equal";

// Date format
import { format } from "date-fns";

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

  componentDidMount() {
    const photographerID = this.props.match.params.photographerID;
    this.props.getPhotographerPage(photographerID);
    const photoDetails = this.props.photographerDetails;
    this.assignValues(photoDetails);
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.photographerDetails, prevProps.photographerDetails)) {
      this.assignValues(this.props.photographerDetails);
    }
  }

  handleDateChange = (date) => {
    this.setState({
      selectedDate: date,
    });
  };

  render() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={2} />
        <Grid item xs={8}>
          <Card
            key={this.state.photographerID}
            photographerID={this.state.photographerID}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            profileImage={this.state.profileImage}
          />
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={2} />
        <Grid item xs={6}>
          <Date
            theDate={this.state.selectedDate}
            parentCallback={this.handleDateChange}
          />
          {console.log(this.state.selectedDate)}
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  photographerDetails: state.data.photographerPage,
});

const mapActionsToProps = {
  getPhotographerPage,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(book));
