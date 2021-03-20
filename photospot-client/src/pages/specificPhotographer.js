// React
import React, { Component } from "react";

// Material UI
import Collapse from "@material-ui/core/Collapse";
import Fab from "@material-ui/core/Fab";
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
import defaultProfilePicture from "../images/defaultProfilePicture.png";
import defaultBackground from "../images/defaultBackground.jpg";

// Redux
import { connect } from "react-redux";
import StarRatings from "react-star-ratings";
import { getPhotographerPage, getReviews } from "../redux/actions/dataActions";
import { reviewPhotographer, getUserData } from "../redux/actions/userActions";

// Components
import Bio from "../components/photographer-page/bio";
import PhotoSamples from "../components/photographer-page/photoSamples";
import ReviewDialog from "../components/photographer-page/reviewDialog";
import Usercard from "../components/photographer-page/usercard";
import PhotographerReviews from "../components/shared/photographerReviews";
import UserImage from "../components/photographer-page/userImage";
import UserInfo from "../components/photographer-page/userInfo";
import Pricing from "../components/photographer-page/Pricing";
import LoadingPage from "../components/shared/LoadingPage";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class specificPhotographer extends Component {
  constructor() {
    super();
    this.state = {
      allReviews: [],
      photographer: true,
      userEmail: "",
      userProfileImage: "",
      email: "",
      firstName: "",
      lastName: "",
      userFirstName: "",
      userLastName: "",
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
      avgRating: 0,
      title: "",
      newReviewRating: 1,
      description: "",
      pricing: null,
      errors: {},
      openReview: false,
      openBackdrop: false,
      intialLoading: true,
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
        intialLoading: false,
      });
      this.handleCount(this.state.allReviews);
    });
    this.props.credentials &&
      this.props.getUserData().then(() => {
        this.setState({
          openBackdrop: false,
          userEmail: this.props.credentials[0]?.email,
          userFirstName: this.props.credentials[0]?.firstName,
          userLastName: this.props.credentials[0]?.lastName,
          userProfileImage: this.props.credentials[0]?.profileImage,
          photographer: this.props.credentials[0]?.photographer,
        });
      });
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.photographerDetails, prevProps.photographerDetails)) {
      this.assignValues(this.props.photographerDetails);
    }

    if (!equal(this.props.credentials, prevProps.credentials)) {
      if (this.props.credentials) {
        if (this.props.credentials[0]?.photographer) {
          this.setState({
            photographer: true,
          });
        } else {
          this.setState({ photographer: false });
        }
        this.setState({
          photographer: this.props.credentials[0]?.photographer,
          userEmail: this.props.credentials[0]?.email,
          userProfileImage: this.props.credentials[0]?.profileImage,
        });
      }
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
    let overallRating = 0;
    let reviewCount = 0;

    for (let i = 0; i < allReviews.length; i++) {
      overallRating += allReviews[i].rating;
      reviewCount += 1;
    }
    this.setState({
      reviewCount: reviewCount,
      overallRating: overallRating,
      avgRating: overallRating / reviewCount || 0,
    });
  }

  render() {
    const {
      classes,
      UI: { loadingData, loadingReviewAction, newReviewSucess },
      fullScreen,
    } = this.props;

    let allReviews = [];
    for (var key = 0; key < this.state.allReviews.length; key++) {
      allReviews.push(
        <div>
          <PhotographerReviews
            review={this.state.allReviews[key]}
            index={key}
          />
        </div>
      );
    }

    return (
      <>
        {this.state.intialLoading ? (
          <LoadingPage />
        ) : (
          <div>
            <div style={{ margin: "65px auto 0px auto" }}>
              <UserImage
                background={
                  this.state.background
                    ? this.state.background
                    : defaultBackground
                }
                loading={loadingData}
              />
            </div>
            <div
              style={{
                maxWidth: 1000,
                margin: "-350px auto 0 auto",
                paddingBottom: "20px",
              }}
            >
              <Grid
                container
                direction="column"
                alignItems="center"
                justify="center"
              >
                <Usercard
                  authenticated={this.props.user.authenticated}
                  history={this.props.history}
                  firstName={this.state.firstName}
                  lastName={this.state.lastName}
                  userFirstName={this.state.userFirstName}
                  userLastName={this.state.userLastName}
                  email={this.state.email}
                  userEmail={this.state.userEmail}
                  profileImage={
                    this.state.profileImage
                      ? this.state.profileImage
                      : defaultProfilePicture
                  }
                  loading={loadingData}
                  photographer={this.state.photographer}
                />

                <UserInfo
                  firstName={this.state.firstName}
                  lastName={this.state.lastName}
                  location_city={this.state.location_city}
                  location_state={this.state.location_state}
                  instagram={this.state.instagram}
                  company={this.state.company}
                  loading={loadingData}
                  history={this.props.history}
                  headline={this.state.headline}
                  camera={this.state.camera}
                />

                <Pricing
                  pricing={this.state.pricing}
                  fullScreen={fullScreen}
                  selectable={false}
                  handleSelect={() => {}}
                />
              </Grid>

              <Paper
                elevation={3}
                className={classes.paperComponent}
                style={{ marginTop: 0 }}
              >
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justify="flex-start"
                >
                  <Grid item sm={12}>
                    <Bio
                      {...this.props}
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
                                  rating={this.state.avgRating}
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
                                  <Typography display="inline">
                                    ratings
                                  </Typography>
                                ) : (
                                  <Typography display="inline">
                                    rating
                                  </Typography>
                                )}
                              </Typography>
                            </div>
                          }
                          style={{
                            textAlign: "center",
                          }}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => this.handleCheck()}
                          >
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
                {allReviews}
                {this.props.user.authenticated &&
                  this.props.user.credentials[0]?.photographer === false && (
                    <Fab
                      variant="extended"
                      color="secondary"
                      aria-label="add"
                      style={{ margin: "10px 0 20px 0", float: "right" }}
                      onClick={() => this.handleReviewOpenState()}
                    >
                      <AddIcon className={classes.extendedIcon} />
                      <Typography style={{ fontWeight: "bold" }}>
                        ADD REVIEW
                      </Typography>
                    </Fab>
                  )}

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
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  photographerDetails: state.data.photographerPage,
  UI: state.UI,
  credentials: state.user.credentials,
  reviews: state.data.reviews,
  errors: state.UI.errors,
  user: state.user,
});

const mapActionsToProps = {
  getPhotographerPage,
  getReviews,
  reviewPhotographer,
  getUserData,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(specificPhotographer));
