/*
1. Get users current details - ✓
2. Have form to fill in those details
3. Form fields must be pre-filled in if value for that field is already in database
4. With any new changes, submit to backend 
*/
import React, { Component } from "react";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Paper from "@material-ui/core/Paper";

// Redux
import { connect } from "react-redux";
import { getYourPhotographyPage } from "../redux/actions/userActions";

import equal from "fast-deep-equal";

// Components
import EditableUsercard from "../components/your-photography-page/editableUsercard";
import PhotoSamples from "../components/photographer-page/photoSamples";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class editPhotographyPage extends Component {
  constructor() {
    super();
    this.state = {
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

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleBackgroundChange = (event) => {
    const image = event.target.files[0];
    {
      image &&
        this.setState({
          background: URL.createObjectURL(image),
        });
    }
  };

  handleEditBackground = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput.click();
  };

  handleProfileImageChange = (event) => {
    const image = event.target.files[0];
    {
      image &&
        this.setState({
          profileImage: URL.createObjectURL(image),
        });
    }
  };

  handleEditProfileImage = () => {
    const fileInput = document.getElementById("profileImageInput");
    fileInput.click();
  };

  render() {
    const { classes } = this.props;
    return (
      <Paper>
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
        <TextField
          id="standard-full-width"
          name="bio"
          type="text"
          label="Biography"
          style={{ margin: 8 }}
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
        <div className={classes.photoContainer}>
          <PhotoSamples images={this.state.images} />
        </div>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  yourPhotographerPage: state.user.yourPhotographyPageDetails,
});

const mapActionsToProps = {
  getYourPhotographyPage,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(editPhotographyPage));
