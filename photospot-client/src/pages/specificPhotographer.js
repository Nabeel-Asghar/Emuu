// React
import Collapse from "@material-ui/core/Collapse";
import Fab from "@material-ui/core/Fab";
// Material UI
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import equal from "fast-deep-equal";
import React, { Component } from "react";
// Redux
import { connect } from "react-redux";
import StarRatings from "react-star-ratings";
import Bio from "../components/photographer-page/bio";
import PhotoSamples from "../components/photographer-page/photoSamples";
import ReviewDialog from "../components/photographer-page/reviewDialog";
import Usercard from "../components/photographer-page/usercard";
import PhotographerReviews from "../components/photographerReviews";
import { getPhotographerPage, getReviews } from "../redux/actions/dataActions";
import { reviewPhotographer } from "../redux/actions/userActions";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class specificPhotographer extends Component {
  constructor() {
    super();
    this.state = {
      allReviews: [],
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
      title: "",
      newReviewRating: 1,
      description: "",
      errors: {},
      openReview: false,
      openBackdrop: false,
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
    this.props.getReviews(photographerID).then(() => {
      this.setState({
        allReviews: this.props.reviews,
      });
      this.handleCount(this.state.allReviews);
    });
    this.setState({
      openBackdrop: false,
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
        userEmail: this.props.credentials[0]?.email,
        userProfileImage: this.props.credentials[0]?.profileImage,
      });
    }

    if (!equal(this.props.reviews, prevProps.reviews)) {
      this.setState({
        allReviews: this.props.reviews,
      });
      this.handleCount(this.state.allReviews);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors,
      });
    }
    if (nextProps.UI.newReviewSucess) {
      this.handleBackdropOpen();
      console.log("gayyy");
    }
  }

  handleReviewDialogAgree = (title, description) => {
    const details = {
      description: description,
      title: title,
      rating: this.state.newReviewRating,
      photographerFirstName: this.state.firstName,
      photographerLastName: this.state.lastName,
      photographerProfile: this.state.profileImage,
    };

    this.props.reviewPhotographer(
      this.props.match.params.photographerID,
      details
    );
  };

  handleCheck() {
    this.setState({
      checked: !this.state.checked,
    });
  }

  handleReviewOpenState = () => {
    this.setState({
      openReview: !this.state.openReview,
      errors: {},
      response: {},
    });
  };

  handleDisagree = () => {
    this.setState({
      openReview: false,
      errors: {},
      response: {},
    });
  };

  changeRating = (newRating, name) => {
    this.setState({
      newReviewRating: newRating,
    });
  };

  handleBackdropClose = () => {
    this.setState({
      openBackdrop: !this.state.openBackdrop,
      openReview: false,
    });

    window.location.reload();
  };

  handleBackdropOpen = () => {
    this.setState({
      openBackdrop: true,
    });
  };

  handleCount(allReviews) {
    for (let i = 0; i < allReviews.length; i++) {
      let rating = allReviews[i].rating;

      this.handleRatingCount();
      this.handleRatingChange(rating);
    }
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
    const {
      classes,
      UI: { loadingData, loadingReviewAction, newReviewSucess },
    } = this.props;

    let gridImages = [];
    for (var key = 0; key < this.state.allReviews.length; key++) {
      gridImages.push(
        <div>
          <PhotographerReviews
            review={this.state.allReviews[key]}
            index={key}
          />
        </div>
      );
    }

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
                      <div style={{ marginTop: "2px" }}>
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
                          &nbsp;&nbsp;{this.state.reviewCount}{" "}
                          {this.state.reviewCount > 1 ? (
                            <Typography display="inline">ratings</Typography>
                          ) : (
                            <Typography display="inline">rating</Typography>
                          )}
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

        <Collapse in={this.state.checked}>
          {gridImages}
          <Fab
            variant="extended"
            color="secondary"
            aria-label="add"
            style={{ margin: "10px 0 20px 0", float: "right" }}
            onClick={() => this.handleReviewOpenState()}
          >
            <AddIcon className={classes.extendedIcon} />
            <Typography style={{ fontWeight: "bold" }}>ADD REVIEW</Typography>
          </Fab>
          <ReviewDialog
            openReview={this.state.openReview}
            errors={this.state.errors}
            loadingReviewAction={loadingReviewAction}
            newReviewSucess={newReviewSucess}
            handleDisagree={this.handleDisagree}
            changeRating={this.changeRating}
            handleBackdropClose={this.handleBackdropClose}
            handleReviewOpenState={this.handleReviewOpenState}
            handleReviewDialogAgree={this.handleReviewDialogAgree}
            newReviewRating={this.state.newReviewRating}
            description={this.state.description}
            title={this.state.title}
            rating={this.state.newReviewRating}
            photographerProfile={this.state.profileImage}
            photographerLastName={this.state.lastName}
            photographerFirstName={this.state.firstName}
            openBackdrop={this.state.openBackdrop}
            type={"Review Photographer"}
            typeReview="submitted"
          />
        </Collapse>

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
  reviews: state.data.reviews,
  errors: state.UI.errors,
});

const mapActionsToProps = {
  getPhotographerPage,
  getReviews,
  reviewPhotographer,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(specificPhotographer));
