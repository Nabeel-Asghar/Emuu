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
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";

// Redux
import { connect } from "react-redux";
import {
  getYourPhotographyPage,
  updatePhotographerPage,
  uploadProfileImage,
  uploadBackgroundImage,
} from "../redux/actions/userActions";

import equal from "fast-deep-equal";

// Components
import EditableUsercard from "../components/your-photography-page/editableUsercard";
import PhotoSamples from "../components/photographer-page/photoSamples";
import EditBio from "../components/your-photography-page/editBio";
import EditUserDetails from "../components/your-photography-page/editUserDetails";

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
      openDetails: false,
      fakeBio: "",
      headline: "",
      camera: "",
      fakeInstagram: "",
      fakeCamera: "",
      fakeCompany: "",
      fakeHeadline: "",
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

  handleBioClickOpen = () => {
    this.setState({
      open: true,
      fakeBio: this.state.bio,
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
    });
  };

  handleBioAgree = (event) => {
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

    this.props.updatePhotographerPage(details);
  };

  // Handle user card changes

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
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
    });

    this.setState({
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

  handleClickOpen = () => {
    this.setState({
      openDetails: true,
      fakeInstagram: this.state.instagram,
      fakeCamera: this.state.camera,
      fakeCompany: this.state.company,
      fakeHeadline: this.state.headline,
    });
  };

  //------

  render() {
    const { loading, classes } = this.props;

    return (
      <div>
        <Paper elevation={3} className={classes.margin}>
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
        </Paper>

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

        <Paper elevation={3} className={classes.margin}>
          <Grid container>
            <Grid item xs={10}>
              <TextField
                className={classes.textGrid}
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
              bio={this.state.fakeBio}
            />
            <Grid item xs={2}>
              <List style={{ marginTop: "10px" }}>
                <ListItem>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="icon">
                      <EditIcon
                        color="secondary"
                        onClick={this.handleBioClickOpen}
                      />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>
        <Paper elevation={3} className={classes.margin}>
          <Grid
            container
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12} className={classes.centerGrid}>
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                style={{ margin: "10px" }}
                to={{
                  pathname: "/uploadPhotographyPictures",
                  state: {
                    images: this.state.images,
                  },
                }}
              >
                Edit Pictures
              </Button>
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
    );
  }
}

const mapStateToProps = (state) => ({
  yourPhotographerPage: state.user.yourPhotographyPageDetails,
  loading: state.UI.loadingData,
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
