/*
1. Get users current details - ✓
2. Have form to fill in those details
3. Form fields must be pre-filled in if value for that field is already in database
4. With any new changes, submit to backend 
*/
import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import Paper from "@material-ui/core/Paper";

// Redux
import { connect } from "react-redux";
import {
  getYourPhotographyPage,
  editPhotographerBio,
  uploadProfileImage,
  uploadBackgroundImage,
} from "../redux/actions/userActions";

import equal from "fast-deep-equal";

// Components
import EditableUsercard from "../components/your-photography-page/editableUsercard";
import PhotoSamples from "../components/photographer-page/photoSamples";
import EditBio from "../components/your-photography-page/editBio";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class editPhotographyPage extends Component {
  constructor() {
    super();
    this.state = {
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
      fakeBio: "",
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
    // Get the users current details
    this.props.getYourPhotographyPage().then(() => {
      this.assignValues(this.props.yourPhotographerPage);
    });
  }

  componentDidUpdate(prevProps) {
    if (
      !equal(this.props.yourPhotographerPage, prevProps.yourPhotographerPage)
    ) {
      this.props.getYourPhotographyPage().then(() => {
        this.assignValues(this.props.yourPhotographerPage);
        console.log(this.props.yourPhotographerPage);
      });
    }
  }

  handleBackgroundChange = (event) => {
    const image = event.target.files[0];
    console.log(image);
    {
      image &&
        this.setState({
          background: URL.createObjectURL(image),
        });
    }
    const formData = new FormData();
    formData.append("image", image, image.name);
    console.log(formData);
    this.props.uploadBackgroundImage(formData);
  };

  handleEditBackground = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

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
    console.log(formData);
    this.props.uploadProfileImage(formData);
  };

  handleEditProfileImage = () => {
    const fileInput = document.getElementById("profileImageInput");
    fileInput.click();
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
      fakeBio: this.state.bio,
    });
  };

  handleChange = (event) => {
    this.setState({
      fakeBio: event.target.value,
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
      bio: this.state.fakeBio,
    });
    const details = {
      bio: this.state.fakeBio,
    };

    console.log("REAL ", this.state.bio);
    console.log("FAKE", this.state.fakeBio);

    this.props.editPhotographerBio(details);
  };

  render() {
    const { loading, classes } = this.props;

    return (
      <Paper>
        <Grid container>
          <Grid item xs={12}>
            <EditableUsercard
              profileImage={this.state.profileImage}
              background={this.state.background}
              firstName={this.state.firstName}
              lastName={this.state.lastName}
              handleBackgroundChange={this.handleBackgroundChange}
              handleEditBackground={this.handleEditBackground}
              handleProfileImageChange={this.handleProfileImageChange}
              handleEditProfileImage={this.handleEditProfileImage}
            />
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={10}>
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
              onChange={this.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <EditBio
            open={this.state.open}
            handleAgree={this.handleAgree}
            handleDisagree={this.handleDisagree}
            handleChange={this.handleChange}
            bio={this.state.fakeBio}
          />
          <Grid item xs={1}>
            <Button onClick={this.handleClickOpen}>
              <EditIcon color="primary" />
            </Button>
          </Grid>
          <Grid item xs={12} className={classes.centerGrid}>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              to={{
                pathname: "/uploadPhotographyPictures",
                state: {
                  images: this.state.images,
                },
              }}
            >
              Change Pictures
            </Button>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={10} direction="column">
            <PhotoSamples
              loading={loading}
              key={this.state.images}
              images={this.state.images}
            />
          </Grid>
          <Grid item xs={1} />
        </Grid>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  yourPhotographerPage: state.user.yourPhotographyPageDetails,
  loading: state.UI.loadingData,
});

const mapActionsToProps = {
  getYourPhotographyPage,
  editPhotographerBio,
  uploadProfileImage,
  uploadBackgroundImage,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(editPhotographyPage));
