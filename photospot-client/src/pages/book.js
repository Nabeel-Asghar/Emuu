import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

// MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// Redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPhotographerPage } from "../redux/actions/dataActions";

// Components
import Card from "../components/booking/card";

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
    };
  }

  verifyID(details, id) {
    details.forEach((task) =>
      Object.entries(task).forEach(([key, value]) => {
        if (key === "photographerID" && value === id) {
          return true;
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
    const photoDetails = this.props.photographerDetails;
    if (this.verifyID(photoDetails)) {
      this.assignValues(photoDetails, photographerID);
    } else {
      this.props.getPhotographerPage(photographerID);
      const photoDetails = this.props.photographerDetails;
      this.assignValues(photoDetails);
    }
  }

  render() {
    let theCard = (
      <Card
        key={this.state.photographerID}
        photographerID={this.state.photographerID}
        firstName={this.state.firstName}
        lastName={this.state.lastName}
        profileImage={this.state.profileImage}
      />
    );

    return (
      <Grid container spacing={3}>
        <Grid item xs={2} />
        <Grid item xs={8}>
          {theCard}
        </Grid>
        <Grid item xs={2} />
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
