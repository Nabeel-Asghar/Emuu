import React, { Component } from "react";

// Redux
import { connect } from "react-redux";
import {
  getUserData,
  uploadProfileImage,
  updateUserProfile,
} from "../redux/actions/userActions";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

// components
import EditProfileImage from "../components/user-profile/editProfileImage";
import EditUserDetails from "../components/user-profile/editUserDetails";
import Feedback from "../components/feedback";

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

  componentDidMount() {
    this.props.getUserData().then(() => {
      this.assignValues(this.props.credentials);
    });
  }

  handleProfileImageChange = (event) => {
    const image = event.target.files[0];
    console.log(image);
    {
      image &&
        this.setState({
          profileImage: URL.createObjectURL(image),
        });
    }
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadProfileImage(formData);
  };

  handleEditProfileImage = () => {
    const fileInput = document.getElementById("profileImageInput");
    fileInput.click();
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
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
      <Grid container spacing={1}>
        <Feedback
          errors={errors}
          open={this.state.openSnack}
          handleClose={this.handleSnackbarClose}
        />

        {console.log("somthing")}

        <Grid item sm={1} xs={0} />
        <Grid item md={4} sm={12} xs={12} className={classes.centerGrid}>
          <Paper>
            <EditProfileImage
              profileImage={this.state.profileImage}
              handleProfileImageChange={this.handleProfileImageChange}
              handleEditProfileImage={this.handleEditProfileImage}
            />
          </Paper>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Paper>
            <EditUserDetails
              firstName={this.state.firstName}
              lastName={this.state.lastName}
              location_city={this.state.location_city}
              location_state={this.state.location_state}
              phoneNumber={this.state.phoneNumber}
              handleChange={this.handleChange}
              handleAgree={this.handleAgree}
              loading={loadingAction}
            />
          </Paper>
        </Grid>

        <Grid item sm={1} xs={0} />
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
  UI: state.UI,
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
