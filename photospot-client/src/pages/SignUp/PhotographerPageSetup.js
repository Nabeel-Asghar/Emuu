import { Slide } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";
import { connect } from "react-redux";
import OutlinedTextField from "../../components/shared/OutlinedTextField";
import PictureUploader from "../../components/shared/pictureUploader";
import SnackbarAlert from "../../components/shared/SnackbarAlert";
import EditProfileImage from "../../components/user-profile/editProfileImage";
import {
  setPhotographerPage,
  uploadProfileImage,
} from "../../redux/actions/userActions";
import { photographerPageSetupTextFields } from "../../util/constants";
import Categories from "./Categories";

const styles = (theme) => ({
  ...theme.spreadThis,
  textFieldWidth: {
    margin: "0px auto 15px auto",
    width: "100%",
    textAlign: "left",
  },
  customError: {
    color: "red",
    marginBottom: "15px",
  },
  paper: {
    maxWidth: "500px",
    margin: "auto",
  },
  header: {
    textAlign: "center",
  },
  textFieldDescription: { marginTop: "10px", marginBottom: "8px" },
  customError: {
    color: "red",
    marginBottom: "15px",
  },
});

class photographerPageSetup extends Component {
  constructor() {
    super();
    this.state = {
      categories: [],
      camera: "",
      headline: "",
      instagram: "",
      company: "",
      bio: "",
      loading: false,
      open: "true",
      openEditor: false,
      profileImageName: "",
      croppedProfileImage: "",
      errors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      console.log(nextProps.UI.errors);
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    const additionalData = {
      bio: this.state.bio,
      camera: this.state.camera,
      categories: this.state.categories,
      company: this.state.company,
      headline: this.state.headline,
      instagram: this.state.instagram,
      profileImageName: this.state.profileImageName,
    };
    this.props.setPhotographerPage(additionalData, this.props.history);
  };

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

  handleEditProfileImage = () => {
    const fileInput = document.getElementById("profileImageInput");
    fileInput.click();
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

  handleChange = (event) => {
    let x = "errors." + [event.target.name];
    console.log(x);
    this.setState({ [event.target.name]: event.target.value, [x]: "" });
  };

  handleCategoryChanges = (values) => {
    this.setState({ categories: values });
  };

  handleDelete = (chipToDelete) => () => {
    let categories = this.state.categories;
    this.handleCategoryChanges(
      categories.filter((items) => items !== chipToDelete)
    );
  };

  render() {
    const {
      classes,
      UI: { loading },
    } = this.props;
    const { errors } = this.state;
    return (
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={400}>
        <Grid container spacing={2} className={classes.signUpContainer}>
          <SnackbarAlert
            open={this.state.open}
            severity={"info"}
            handleClose={this.handleClose}
            message={"You must fill out this page to use Photospot!"}
          />
          <Grid item md={2} xs={0} />
          <Grid item md={8} xs={12}>
            <Paper className={classes.paper}>
              <div className={classes.authText}>
                <div className={classes.header}>
                  <Typography variant="h4" gutterBottom color="secondary">
                    Photographer Page Setup
                  </Typography>
                  <Typography variant="h5">Select a profile picture</Typography>

                  <EditProfileImage
                    profileImage={this.state.profileImage}
                    handleProfileImageChange={this.handleProfileImageChange}
                    handleEditProfileImage={this.handleEditProfileImage}
                  />
                  <PictureUploader
                    {...this.props}
                    image={this.state.croppedProfileImage}
                    name={this.state.profileImageName}
                    open={this.state.openEditor}
                    closeEditor={() => this.setState({ openEditor: false })}
                    savePicture={(image) => this.saveProfileImage(image)}
                    aspect={1}
                  />
                  {errors?.profileImageName && (
                    <Typography variant="body1" className={classes.customError}>
                      {errors?.profileImageName}
                    </Typography>
                  )}
                </div>
                <form noValidate onSubmit={this.handleSubmit}>
                  <div className={classes.textFieldDescription}>
                    <Typography
                      variant="h7"
                      align="left"
                      style={{ fontWeight: 600 }}
                    >
                      Select from the list the type of shoots that you can do
                    </Typography>
                  </div>

                  <Categories
                    errors={errors?.categories}
                    categories={this.state.categories}
                    handleChange={this.handleChange}
                    handleDelete={this.handleDelete}
                  />

                  {photographerPageSetupTextFields.map((item) => {
                    return (
                      <div>
                        <div className={classes.textFieldDescription}>
                          <Typography
                            variant="h7"
                            align="left"
                            style={{ fontWeight: 600 }}
                          >
                            {item.description}
                          </Typography>
                        </div>
                        <OutlinedTextField
                          name={item.name}
                          label={item.label}
                          errors={errors?.[item.name]}
                          value={this.state[item.name]}
                          handleChange={this.handleChange}
                        />
                      </div>
                    );
                  })}

                  {errors?.general && (
                    <Typography variant="body2" className={classes.customError}>
                      {errors?.general}
                    </Typography>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    disabled={loading}
                    fullWidth
                  >
                    SUBMIT
                    {loading && (
                      <CircularProgress
                        color="secondary"
                        className={classes.progress}
                      />
                    )}
                  </Button>
                </form>
              </div>
            </Paper>
          </Grid>
          <Grid item md={2} xs={0}></Grid>
        </Grid>
      </Slide>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, {
  setPhotographerPage,
  uploadProfileImage,
})(withStyles(styles)(photographerPageSetup));
