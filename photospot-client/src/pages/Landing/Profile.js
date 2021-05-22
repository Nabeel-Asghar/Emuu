import React, { Component } from "react";

// Redux
import { connect } from "react-redux";
import {
  getUserData,
  uploadProfileImage,
  updateUserProfile,
} from "../../redux/actions/userActions";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

// components
import EditProfileImage from "../../components/UserProfile/EditProfileImage";
import EditUserDetails from "../../components/UserProfile/EditUserDetails";
import Feedback from "../../components/Shared/Feedback";
import PictureUploader from "../../components/Shared/PictureUploader";
import LoadingPage from "../../components/Shared/LoadingPage";
import GoBackButton from "../../components/Shared/Buttons/GoBackButton";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class profileImage extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      location_city: "",
      location_state: "",
      profileImage: "",
      phoneNumber: "",
      openSnack: false,
      openEditor: false,
      profileImageName: "",
      croppedProfileImage: "",
      disabled: true,
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
    await this.props.getUserData().then(() => {
      this.assignValues(this.props.credentials);
    });
    this.setState({ intialLoading: false });
  }

  handleProfileImageChange = (event) => {
    const image = event.target.files[0];
    {
      image &&
        this.setState({
          openEditor: true,
          profileImageName: image.name,
          croppedProfileImage: URL.createObjectURL(image),
        });
    }
  };

  saveProfileImage = (image) => {
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadProfileImage(formData).then(() =>
      this.setState({
        openEditor: false,
        openSnack: true,
        profileImage: URL.createObjectURL(image),
      })
    );
  };

  handleEditProfileImage = () => {
    const fileInput = document.getElementById("profileImageInput");
    fileInput.click();
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      disabled: false,
    });
  };

  handleAgree = (event) => {
    const details = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      location_city: this.state.location_city,
      location_state: this.state.location_state,
    };

    this.props.updateUserProfile(details).then(() => {
      this.setState({
        openSnack: true,
      });
    });
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ openSnack: false });
  };

  render() {
    const {
      classes,
      UI: { loadingAction, errors },
    } = this.props;

    return (
      <>
        {this.state.intialLoading ? (
          <LoadingPage />
        ) : (
          <>
            <GoBackButton {...this.props} />
            <Grid
              container
              spacing={1}
              style={{ maxWidth: 500, margin: "0 auto" }}
            >
              <Feedback
                errors={
                  errors?.firstName ||
                  errors?.lastName ||
                  this.props?.user?.uploadErrorResponse
                }
                open={this.state.openSnack}
                handleClose={this.handleSnackbarClose}
              />

              <Grid item sm={12} xs={12} className={classes.centerGrid}>
                <Paper>
                  <EditProfileImage
                    profileImage={this.state.profileImage}
                    handleProfileImageChange={this.handleProfileImageChange}
                    handleEditProfileImage={this.handleEditProfileImage}
                  />
                </Paper>
              </Grid>

              <PictureUploader
                {...this.props}
                image={this.state.croppedProfileImage}
                name={this.state.profileImageName}
                open={this.state.openEditor}
                closeEditor={() => this.setState({ openEditor: false })}
                savePicture={(image) => this.saveProfileImage(image)}
                aspect={1}
              />

              <Grid item sm={12} xs={12}>
                <Paper>
                  <EditUserDetails
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    location_city={this.state.location_city}
                    location_state={this.state.location_state}
                    phoneNumber={this.state.phoneNumber}
                    handleChange={this.handleChange}
                    handleAgree={this.handleAgree}
                    errors={this.props.UI.errors}
                    loading={loadingAction}
                    disabled={this.state.disabled}
                  />
                </Paper>
              </Grid>

              <Grid item sm={1} xs={0} />
            </Grid>
          </>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
  UI: state.UI,
  user: state.user,
});

const mapActionsToProps = {
  getUserData,
  uploadProfileImage,
  updateUserProfile,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(profileImage));
