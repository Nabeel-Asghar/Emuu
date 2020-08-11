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
import Switch from "@material-ui/core/Switch";
import Collapse from "@material-ui/core/Collapse";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import StarRatings from "react-star-ratings";

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
import Review from "../components/photographer-page/review";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class specificPhotographer extends Component {
  constructor() {
    super();
    this.state = {
      userEmail: "",
      userProfileImage: "",
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
      checked: false,
      overallRating: 0,
      reviewCount: 0,
      trueOverall: 0,
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
    this.setState({
      userEmail: this.props.credentials[0]?.email,
      userProfileImage: this.props.credentials[0]?.profileImage,
    });
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.photographerDetails, prevProps.photographerDetails)) {
      this.assignValues(this.props.photographerDetails);
    }

    if (!equal(this.props.credentials, prevProps.credentials)) {
      this.setState({
        userEmail: this.props.credentials[0].email,
        userProfileImage: this.props.credentials[0].profileImage,
      });
    }
  }

  handleCheck() {
    this.setState({
      checked: !this.state.checked,
    });
  }

  handleRatingCount = () => {
    let count = this.state.reviewCount;
    this.setState({
      reviewCount: count + 1,
    });
  };

  handleRatingChange = (rating) => {
    let overall = this.state.overallRating + rating;
    this.setState({
      overallRating: overall,
    });
    this.setState({
      trueOverall: this.state.overallRating / this.state.reviewCount,
    });
  };

  render() {
    console.log(this.state.userEmail, this.state.email);
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
                background={this.state.background}
                firstName={this.state.firstName}
                lastName={this.state.lastName}
                email={this.state.email}
                profileImage={this.state.profileImage}
                userEmail={this.state.userEmail}
                userProfileImage={this.state.userProfileImage}
                credentials={this.props.credentials}
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
            direction="row"
            alignItems="center"
            justify="flex-start"
          >
            <Grid item sm={12}>
              <Bio
                key={this.state.bio}
                bio={this.state.bio}
                loading={loadingData}
              />
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} className={classes.margin}>
          <Grid container>
            <Grid item xs={12}>
              <List dense="true">
                <ListItem>
                  <ListItemText
                    primary={
                      <div>
                        <Typography variant="subtitle2" display="inline">
                          <StarRatings
                            rating={this.state.trueOverall}
                            numberOfStars={5}
                            name="rating"
                            starDimension="20px"
                            starRatedColor="#23ba8b"
                            starSpacing="3px"
                          />
                        </Typography>
                        <Typography variant="subtitle2" display="inline">
                          &nbsp;&nbsp;{this.state.reviewCount} ratings
                        </Typography>
                      </div>
                    }
                    style={{
                      textAlign: "center",
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => this.handleCheck()}>
                      {this.state.checked ? (
                        <KeyboardArrowDownIcon />
                      ) : (
                        <KeyboardArrowLeftIcon />
                      )}
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>

        <Review
          checked={this.state.checked}
          id={this.props.match.params.photographerID}
          overallRating={this.state.overallRating}
          reviewCount={this.state.reviewCount}
          handleRatingChange={this.handleRatingChange}
          handleRatingCount={this.handleRatingCount}
        />

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
          </Grid>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  photographerDetails: state.data.photographerPage,
  UI: state.UI,
  credentials: state.user.credentials,
});

const mapActionsToProps = {
  getPhotographerPage,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(specificPhotographer));
