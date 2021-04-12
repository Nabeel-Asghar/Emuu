import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import React, { Component } from "react";
import { connect } from "react-redux";
import PhotoSamples from "../../components/photographer-page/photoSamples";
import Pricing from "../../components/photographer-page/Pricing";
import EditButton from "../../components/shared/Buttons/EditButton";
import Feedback from "../../components/shared/feedback";
import LoadingPage from "../../components/shared/loadingPage";
import PictureUploader from "../../components/shared/pictureUploader";
import EditableUsercard from "../../components/your-photography-page/editableUsercard";
import EditBio from "../../components/your-photography-page/editBio";
import EditUserDetails from "../../components/your-photography-page/editUserDetails";
import PricingEditor from "../../components/your-photography-page/PricingEditor";
import RotatingCarousel from "../../components/your-photography-page/RotatingCarousel";
import {
  getYourPhotographyPage,
  updatePhotographerPage,
  uploadBackgroundImage,
  uploadProfileImage,
} from "../../redux/actions/userActions";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class editPhotographyPage extends Component {
  constructor() {
    super();
    this.state = {
      disableTextField: true,
      openBio: false,
      openDetails: false,
      openBackgroundEditor: false,
      openProfileEditor: false,
      openFeedback: false,
      openAlert: true,
      categories: [],
      pricingMap: {},
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
      headline: "",
      camera: "",
      backgroundImageName: "",
      backgroundImage: "",
      profileImageName: "",
      croppedProfileImage: "",
      tempBio: "",
      tempInstagram: "",
      tempCamera: "",
      tempCompany: "",
      tempheadline: "",
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
    this.setState({
      openBio: true,
      tempBio: this.state.bio,
    });
  };

  handlePricingOpen = () => {
    this.setState({
      openPricing: true,
    });
  };

  handleClickOpen = () => {
    this.setState({
      openDetails: true,
      tempInstagram: this.state.instagram,
      tempCamera: this.state.camera,
      tempCompany: this.state.company,
      tempheadline: this.state.headline,
    });
  };

  handlePricingAgree = (passedCategories, passedPricingMap) => {
    this.setState({
      openPricing: false,
      categories: passedCategories,
      pricingMap: passedPricingMap,
    });

    const details = {
      categories: passedCategories,
      pricingMap: passedPricingMap,
    };

    this.props.updatePhotographerPage(details);
  };

  handleBioChange = (event) => {
    this.setState({ tempBio: event.target.value });
  };

  handleBioAgree = (event) => {
    this.setState({
      open: false,
      bio: this.state.tempBio,
    });
    const details = { bio: this.state.tempBio };

    this.props.updatePhotographerPage(details);
  };

  // Handle user card changes

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleAgree = (event) => {
    this.setState({
      openDetails: false,
      instagram: this.state.tempInstagram,
      camera: this.state.tempCamera,
      company: this.state.tempCompany,
      headline: this.state.tempheadline,
    });

    const details = {
      instagram: this.state.tempInstagram,
      camera: this.state.tempCamera,
      company: this.state.tempCompany,
      headline: this.state.tempheadline,
    };

    this.props.updatePhotographerPage(details);
  };

  handleClose = (dialogName) => {
    this.setState({ [dialogName]: false });
  };

  handleAlertClose = () => {
    this.setState({ openAlert: false });
  };

  render() {
    const { loading, classes } = this.props;

    return (
      <div>
        {this.state.intialLoading ? (
          <LoadingPage />
        ) : (
          <div style={{ overflow: "hidden" }}>
            <RotatingCarousel
              open={this.state.openAlert}
              handleOpen={this.handleAlertClose}
              handleClose={this.handleAlertClose}
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
              handleClose={this.handleClose}
              handleChange={this.handleChange}
              instagram={this.state.tempInstagram}
              camera={this.state.tempCamera}
              company={this.state.tempCompany}
              headline={this.state.tempheadline}
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
                  pricing={this.state.pricingMap}
                  handleSelect={() => {}}
                  onClick={this.handlePricingOpen}
                  editable={true}
                  selectable={false}
                />
                <PricingEditor
                  open={this.state.openPricing}
                  pricingMap={this.state.pricingMap}
                  categories={this.state.categories}
                  handlePricingAgree={this.handlePricingAgree}
                  handleClose={this.handleClose}
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
      </div>
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
