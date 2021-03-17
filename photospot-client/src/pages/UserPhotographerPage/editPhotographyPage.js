/*
1. Get users current details - ✓
2. Have form to fill in those details
3. Form fields must be pre-filled in if value for that field is already in database
4. With any new changes, submit to backend 
*/
import { useMediaQuery } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import equal from "fast-deep-equal";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PhotoSamples from "../../components/photographer-page/photoSamples";
import Feedback from "../../components/shared/feedback";
import PictureUploader from "../../components/shared/pictureUploader";
import EditableUsercard from "../../components/your-photography-page/editableUsercard";
import EditBio from "../../components/your-photography-page/editBio";
import EditUserDetails from "../../components/your-photography-page/editUserDetails";
import {
  getYourPhotographyPage,
  updatePhotographerPage,
  uploadBackgroundImage,
  uploadProfileImage,
} from "../../redux/actions/userActions";
import RotatingCarousel from "../../components/your-photography-page/RotatingCarousel";
import EditButton from "../../components/shared/Buttons/EditButton";
import Pricing from "../../components/photographer-page/Pricing";
import PricingEditor from "../../components/your-photography-page/PricingEditor";
import LoadingPage from "../../components/shared/LoadingPage";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class editPhotographyPage extends Component {
  constructor() {
    super();
    this.state = {
      tempCategories: [],
      categories: [],
      disableTextField: true,
      firstName: "",
      lastName: "",
      email: "",
      background: "",
      profileImage: "",
      images: [],
      bio: "",
      location_city: "",
      location_state: "",
      company: "",
      instagram: "",
      website: "",
      ratePerHour: "",
      open: false,
      openDetails: false,
      fakeBio: "",
      headline: "",
      camera: "",
      fakeInstagram: "",
      fakeCamera: "",
      fakeCompany: "",
      fakeHeadline: "",
      backgroundImageName: "",
      openBackgroundEditor: false,
      backgroundImage: "",
      profileImageName: "",
      openProfileEditor: false,
      croppedProfileImage: "",
      openFeedback: false,
      openAlert: false,
      pricing: null,
      intialLoading: true,
    };
  }

  assignStates = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  assignValues(details) {
    if (details) {
      const photoDetails = Object.values(details);

      photoDetails.forEach((task) =>
        Object.entries(task).forEach(([key, value]) => {
          this.assignStates(key, value);
        })
      );
    }
  }

  async componentDidMount() {
    // Get the users current details
    await this.props.getYourPhotographyPage().then(() => {
      this.assignValues(this.props.yourPhotographerPage);
    });
    this.setState({
      openAlert: this.props.location.state?.success,
      intialLoading: false,
    });
  }

  // componentDidUpdate(prevProps) {
  //   if (
  //     !equal(this.props.yourPhotographerPage, prevProps.yourPhotographerPage)
  //   ) {
  //     this.props.getYourPhotographyPage().then(() => {
  //       this.assignValues(this.props.yourPhotographerPage);
  //     });
  //   }
  // }

  handleBackgroundChange = (event) => {
    const image = event.target.files[0];

    image &&
      this.setState({
        backgroundImageName: image.name,
        backgroundImage: URL.createObjectURL(image),
        openBackgroundEditor: true,
      });
  };

  saveBackgroundImage = (image) => {
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadBackgroundImage(formData).then(() =>
      this.setState({
        openFeedback: true,
        background: URL.createObjectURL(image),
        openBackgroundEditor: false,
      })
    );
  };

  handleEditBackground = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  saveProfileImage = (image) => {
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadProfileImage(formData).then(() =>
      this.setState({
        openFeedback: true,
        profileImage: URL.createObjectURL(image),
        openProfileEditor: false,
      })
    );
  };

  handleProfileImageChange = (event) => {
    const image = event.target.files[0];
    {
      image &&
        this.setState({
          profileImageName: image.name,
          openProfileEditor: true,
          croppedProfileImage: URL.createObjectURL(image),
        });
    }
  };

  handleEditProfileImage = () => {
    const fileInput = document.getElementById("profileImageInput");
    fileInput.click();
  };

  handleBioClickOpen = () => {
    let x = Object.assign([], this.state.categories);
    this.setState({
      open: true,
      fakeBio: this.state.bio,
      tempCategories: x,
    });
  };

  handlePricingOpen = () => {
    this.setState({
      openPricing: true,
    });
  };

  handlePricingAgree = () => {
    this.setState({
      openPricing: false,
    });
  };
  handlePricingClose = () => {
    this.setState({
      openPricing: false,
    });
  };

  handleBioChange = (event) => {
    this.setState({
      fakeBio: event.target.value,
    });
  };

  handleBioDisagree = () => {
    this.setState({
      open: false,
      tempCategories: this.state.categories,
    });
  };

  handleBioAgree = (event) => {
    this.setState({
      open: false,
      bio: this.state.fakeBio,
      categories: this.state.tempCategories,
    });
    const details = {
      bio: this.state.fakeBio,
      categories: this.state.tempCategories,
    };

    this.props.updatePhotographerPage(details);
  };

  // Handle user card changes

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleCategoryChange = (event) => {
    let categoryArray = this.state.tempCategories;
    if (categoryArray.includes(event.target.name)) {
      const index = categoryArray.indexOf(event.target.name);
      if (index > -1) {
        categoryArray.splice(index, 1);
      }
    } else {
      categoryArray.push(event.target.name);
    }

    this.setState({
      tempCategories: categoryArray,
    });
  };

  handleDisagree = () => {
    this.setState({
      openDetails: false,
    });
  };

  handleAgree = (event) => {
    this.setState({
      openDetails: false,
      instagram: this.state.fakeInstagram,
      camera: this.state.fakeCamera,
      company: this.state.fakeCompany,
      headline: this.state.fakeHeadline,
    });

    const details = {
      instagram: this.state.fakeInstagram,
      camera: this.state.fakeCamera,
      company: this.state.fakeCompany,
      headline: this.state.fakeHeadline,
    };

    this.props.updatePhotographerPage(details);
  };

  changeCatergories = () => {
    console.log(this.state.categories);
  };

  handleClose = () => {
    this.setState({ openAlert: false });
  };

  handleClickOpen = () => {
    this.setState({
      openDetails: true,
      fakeInstagram: this.state.instagram,
      fakeCamera: this.state.camera,
      fakeCompany: this.state.company,
      fakeHeadline: this.state.headline,
    });
  };

  render() {
    const { loading, classes } = this.props;

    return (
      <>
        {this.state.intialLoading ? (
          <LoadingPage />
        ) : (
          <div style={{ overflow: "hidden" }}>
            {/* <SnackbarAlert
          open={this.state.openAlert}
          severity={"success"}
          handleClose={this.handleClose}
          message={
            "You're all set to go. This is your photography page where you can \n\nedit any existing details and change your background and profile picture"
          }
        /> */}

            <RotatingCarousel
              open={this.state.openAlert}
              handleOpen={this.handleClose}
              handleClose={this.handleClose}
            />

            <Grid container>
              <Grid item xs={12}>
                <EditableUsercard
                  profileImage={this.state.profileImage}
                  background={this.state.background}
                  firstName={this.state.firstName}
                  lastName={this.state.lastName}
                  location_city={this.state.location_city}
                  location_state={this.state.location_state}
                  instagram={this.state.instagram}
                  company={this.state.company}
                  headline={this.state.headline}
                  camera={this.state.camera}
                  loading={loading}
                  handleBackgroundChange={this.handleBackgroundChange}
                  handleEditBackground={this.handleEditBackground}
                  handleProfileImageChange={this.handleProfileImageChange}
                  handleEditProfileImage={this.handleEditProfileImage}
                  handleOpenEdit={this.handleClickOpen}
                  history={this.props.history}
                />
              </Grid>
            </Grid>

            <PictureUploader
              {...this.props}
              image={this.state.croppedProfileImage}
              name={this.state.profileImageName}
              open={this.state.openProfileEditor}
              closeEditor={() => this.setState({ openProfileEditor: false })}
              savePicture={(image) => this.saveProfileImage(image)}
              aspect={1}
            />

            <PictureUploader
              {...this.props}
              image={this.state.backgroundImage}
              name={this.state.backgroundImageName}
              open={this.state.openBackgroundEditor}
              closeEditor={() => this.setState({ openBackgroundEditor: false })}
              savePicture={(image) => this.saveBackgroundImage(image)}
              aspect={10 / 3}
            />

            <Feedback
              open={this.state.openFeedback}
              handleClose={() => this.setState({ openFeedback: false })}
              error={this.props.user.uploadErrorResponse}
            />

            <EditUserDetails
              open={this.state.openDetails}
              handleAgree={this.handleAgree}
              handleDisagree={this.handleDisagree}
              handleChange={this.handleChange}
              instagram={this.state.fakeInstagram}
              camera={this.state.fakeCamera}
              company={this.state.fakeCompany}
              headline={this.state.fakeHeadline}
            />
            <div
              style={{
                maxWidth: 1000,
                margin: "0 auto",
                paddingBottom: "20px",
              }}
            >
              <Grid container>
                <Pricing
                  pricing={this.state.pricing}
                  handleSelect={() => {}}
                  onClick={this.handlePricingOpen}
                  editable={true}
                  selectable={false}
                />
                <PricingEditor
                  open={this.state.openPricing}
                  pricing={this.state.pricing}
                  categories={this.state.categories}
                  handleAgree={this.handlePricingAgree}
                  handleClose={this.handlePricingClose}
                />
              </Grid>

              <Paper elevation={3} className={classes.margin}>
                <Grid container>
                  <EditButton
                    onClick={this.handleBioClickOpen}
                    text="Edit Bio"
                  />
                  <Grid item xs={12}>
                    <TextField
                      disabled
                      id="standard-full-width"
                      name="bio"
                      type="text"
                      label="Biography"
                      value={this.state.bio}
                      helperText="Tell us about yourself"
                      fullWidth
                      multiline
                      rows={4}
                      margin="normal"
                      variant="outlined"
                      onChange={this.handleBioChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <EditBio
                    open={this.state.open}
                    handleAgree={this.handleBioAgree}
                    handleDisagree={this.handleBioDisagree}
                    handleChange={this.handleBioChange}
                    handleCatChange={this.handleCategoryChange}
                    bio={this.state.fakeBio}
                    categories={this.state.tempCategories}
                  />
                </Grid>
              </Paper>
              <Paper elevation={3} className={classes.margin}>
                <Grid container direction="column" justify="center">
                  <Grid item xs={12} className={classes.centerGrid}>
                    <EditButton
                      onClick={() => {
                        this.props.history.push("/uploadPhotographyPictures");
                      }}
                      text="Edit Pictures"
                    />
                  </Grid>
                  <Grid item xs={12} className={classes.centerGrid}>
                    <PhotoSamples
                      key={this.state.images}
                      images={this.state.images}
                      loading={loading}
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
  yourPhotographerPage: state.user.yourPhotographyPageDetails,
  loading: state.UI.loadingData,
  user: state.user,
});

const mapActionsToProps = {
  getYourPhotographyPage,
  updatePhotographerPage,
  uploadProfileImage,
  uploadBackgroundImage,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(editPhotographyPage));
