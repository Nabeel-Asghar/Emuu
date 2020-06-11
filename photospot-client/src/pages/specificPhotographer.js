// React
import React, { Component } from "react";

// Material UI
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
// Redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPhotographerPage } from "../redux/actions/dataActions";

// Components
import ProfileImage from "../components/photographer-page/profileImage";
import ProfileDetails from "../components/photographer-page/profileDetails";
import PhotoSamples from "../components/photographer-page/photoSamples";
import Bio from "../components/photographer-page/bio";

import equal from "fast-deep-equal";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class specificPhotographer extends Component {
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
      console.log(this.props.photographerDetails);
      this.assignValues(this.props.photographerDetails);
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container spacing={3}>
        <Grid item sm={3} xs={12}>
          <ProfileImage
            key={this.state.profileImage}
            profileImage={this.state.profileImage}
          />
        </Grid>
        <Grid item sm={6} xs={12}>
          <ProfileDetails
            key={this.state.firstName}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
          />
        </Grid>

        <Grid item sm={3} xs={12}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() =>
              this.props.history.push(
                `${this.props.history.location.pathname}/book`
              )
            }
          >
            Book
          </Button>
        </Grid>

        <Grid item sm={12}>
          <PhotoSamples key={this.state.images} images={this.state.images} />
        </Grid>

        <Grid item sm={12}>
          <Bio key={this.state.bio} bio={this.state.bio} />
        </Grid>
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
)(withStyles(styles)(specificPhotographer));
