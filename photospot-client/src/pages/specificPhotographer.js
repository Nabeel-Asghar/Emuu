// React
import React, { Component } from "react";
import photographer from "../components/photographer";
import Photographer from "../components/photographer";

// Material UI
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

// Redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPhotographerPage } from "../redux/actions/dataActions";

// Components
import ProfileImage from "../components/photographer-page/profileImage";
import ProfileDetails from "../components/photographer-page/profileDetails";
import PhotoSamples from "../components/photographer-page/photoSamples";

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
    };
  }

  assignStates = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  assignValues(details) {
    const formatted = [];

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

  render() {
    const { classes } = this.props;
    console.log(this.state.images);

    return (
      <Grid container spacing={3}>
        <Grid item sm={3} xs={12}>
          <ProfileImage profileImage={this.state.profileImage} />
        </Grid>
        <Grid item sm={6} xs={12}>
          <ProfileDetails
            firstName={this.state.firstName}
            lastName={this.state.lastName}
          />
        </Grid>

        <Grid item sm={3} xs={12}>
          <Button>Book</Button>
        </Grid>

        <Grid item sm={12}>
          {/* <Typography>{this.state.images}</Typography>; */}
          {/* {this.state.images.map(function (imageSrc) {
            return (
              <li key={imgSrc}>
                <img src={imgSrc} />
              </li>
            );
          })} */}
        </Grid>
      </Grid>
    );
  }
}

photographer.PropTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

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
