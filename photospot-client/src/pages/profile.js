import React, { Component } from "react";

// Redux
import { connect } from "react-redux";
import {
  getUserData,
  uploadProfileImage,
  getUsersOrders,
  getUsersPastOrders,
  updateUserProfile,
} from "../redux/actions/userActions";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Paper, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";

import ImageUploader from "react-images-upload";
import equal from "fast-deep-equal";

// components
import EditProfileImage from "../components/user-profile/editProfileImage";
import OrderCard from "../components/user-profile/orderCard";
import UserDetails from "../components/user-profile/userDetails";

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
      location_city: "Troy",
      location_state: "MI",
      profileImage: "",
      open: false,
      fakeFirstName: "",
      fakeLastName: "",
      fakeCity: "",
      fakeState: "",
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
    this.props.getUsersOrders();
    this.props.getUsersPastOrders();
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

  handleClickOpen = () => {
    this.setState({
      open: true,
      fakeFirstName: this.state.firstName,
      fakeLastName: this.state.lastName,
      fakeCity: this.state.location_city,
      fakeState: this.state.location_state,
    });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleDisagree = () => {
    this.setState({
      open: false,
    });
  };

  handleAgree = (event) => {
    this.setState({
      open: false,
    });

    this.setState({
      firstName: this.state.fakeFirstName,
      lastName: this.state.fakeLastName,
      location_city: this.state.fakeCity,
      location_state: this.state.fakeState,
    });

    const details = {
      firstName: this.state.fakeFirstName,
      lastName: this.state.fakeLastName,
      location_city: this.state.fakeCity,
      location_state: this.state.fakeState,
    };

    this.props.updateUserProfile(details);
  };

  render() {
    const userOrders = this.props.userOrders || {};

    let theUserOrders = Object.keys(userOrders).map((key) => (
      <OrderCard key={key} photographer={userOrders[key]} />
    ));

    const userPastOrders = this.props.userPastOrders || {};

    let theUserPastOrders = Object.keys(userPastOrders).map((key) => (
      <OrderCard key={key} photographer={userPastOrders[key]} />
    ));

    if (theUserPastOrders.length <= 1) {
      theUserPastOrders = (
        <Typography variant="subtitle2">You have no past shoots</Typography>
      );
    }

    if (theUserOrders.length <= 1) {
      theUserOrders = (
        <Typography variant="subtitle2">You have no upcoming shoots</Typography>
      );
    }

    const { classes } = this.props;
    return (
      <Grid container spacing={5}>
        <Grid item xs={4} className={classes.centerGrid}>
          <Paper>
            <EditProfileImage
              profileImage={this.state.profileImage}
              handleProfileImageChange={this.handleProfileImageChange}
              handleEditProfileImage={this.handleEditProfileImage}
            />
            <Typography variant="h5">
              {this.state.firstName} {this.state.lastName}
            </Typography>
            <Typography variant="overline">
              {this.state.location_city}, {this.state.location_state}
            </Typography>
            <Button onClick={this.handleClickOpen}>
              <EditIcon color="primary" />
            </Button>
          </Paper>
        </Grid>

        <UserDetails
          open={this.state.open}
          handleAgree={this.handleAgree}
          handleDisagree={this.handleDisagree}
          handleChange={this.handleChange}
          fname={this.state.fakeFirstName}
          lname={this.state.fakeLastName}
          city={this.state.fakeCity}
          state={this.state.fakeState}
        />

        <Grid item xs={6}>
          <Typography variant="h4">Upcoming Shoot</Typography>
          {theUserOrders}
          <Typography variant="h4">Past Shoots</Typography>
          {theUserPastOrders}
        </Grid>

        <Grid item xs />
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
  userOrders: state.user.userOrders,
  userPastOrders: state.user.userPastOrders,
});

const mapActionsToProps = {
  getUserData,
  uploadProfileImage,
  getUsersOrders,
  getUsersPastOrders,
  updateUserProfile,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(profileImage));
