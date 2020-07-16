import React, { Component } from "react";

// Redux
import { connect } from "react-redux";
import {
  getUserData,
  uploadProfileImage,
  getUsersOrders,
} from "../redux/actions/userActions";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { Paper, Typography } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

import ImageUploader from "react-images-upload";
import equal from "fast-deep-equal";

// components
import EditProfileImage from "../components/user-profile/editProfileImage";
import OrderCard from "../components/user-profile/orderCard";

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

  render() {
    const allThePhotographers = this.props.userOrders || {};

    let recentPhotographers = Object.keys(allThePhotographers).map((key) => (
      <OrderCard key={key} photographer={allThePhotographers[key]} />
    ));

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
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Typography variant="h4">Upcoming Shoot</Typography>
          {recentPhotographers}
        </Grid>

        <Grid item xs />
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
  userOrders: state.user.userOrders,
});

const mapActionsToProps = {
  getUserData,
  uploadProfileImage,
  getUsersOrders,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(profileImage));
