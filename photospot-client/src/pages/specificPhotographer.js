// React
import React, { Component } from "react";
import equal from "fast-deep-equal";

// Material UI
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";

// Redux
import { connect } from "react-redux";
import { getPhotographerPage } from "../redux/actions/dataActions";

// Components
import ProfileImage from "../components/photographer-page/profileImage";
import ProfileDetails from "../components/photographer-page/profileDetails";
import PhotoSamples from "../components/photographer-page/photoSamples";
import Bio from "../components/photographer-page/bio";
import Usercard from "../components/photographer-page/usercard";
import Rating from "../components/photographer-page/rating";

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
      background: "",
      location_city: "",
      location_state: "",
      tags: "",
      website: "",
      instagram: "",
      company: "",
      headline: "",
      camera: "",
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
      this.assignValues(this.props.photographerDetails);
    }
  }

  render() {
    const {
      classes,
      UI: { loadingData },
    } = this.props;
    return (
      <div>
        <Paper elevation={3} className={classes.margin}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12}>
              <Usercard
                profileImage={this.state.profileImage}
                background={this.state.background}
                firstName={this.state.firstName}
                lastName={this.state.lastName}
                location_city={this.state.location_city}
                location_state={this.state.location_state}
                instagram={this.state.instagram}
                company={this.state.company}
                tags={this.state.tags}
                loading={loadingData}
                history={this.props.history}
                headline={this.state.headline}
                camera={this.state.camera}
              />
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={3} className={classes.margin}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12}>
              <Rating loading={loadingData} />
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={3}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12} className={classes.centerGrid}>
              <PhotoSamples
                key={this.state.images}
                images={this.state.images}
                loading={loadingData}
              />
            </Grid>

            <Grid item sm={12}>
              <Bio
                key={this.state.bio}
                bio={this.state.bio}
                loading={loadingData}
              />
            </Grid>
          </Grid>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  photographerDetails: state.data.photographerPage,
  UI: state.UI,
});

const mapActionsToProps = {
  getPhotographerPage,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(specificPhotographer));
