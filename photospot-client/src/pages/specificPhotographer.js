// React
import React, { Component } from "react";
import equal from "fast-deep-equal";

// Material UI
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";

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
    const { classes } = this.props;
    return (
      <Paper>
        <Grid container direction="column" alignItems="center" justify="center">
          <Grid item xs={12}>
            <Usercard
              profileImage={this.state.profileImage}
              background={this.state.background}
              firstName={this.state.firstName}
              lastName={this.state.lastName}
            />
          </Grid>

          <Grid item xs={12}>
            <Rating />
          </Grid>

          <Grid item xs={12}>
            <Button
              className={classes.bookButton}
              variant="contained"
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

          <Grid item />
          <Grid item xs={10}>
            <PhotoSamples key={this.state.images} images={this.state.images} />
          </Grid>
          <Grid item />
          <Grid item sm={12}>
            <Bio key={this.state.bio} bio={this.state.bio} />
          </Grid>
        </Grid>
      </Paper>
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
