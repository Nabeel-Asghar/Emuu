import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import React, { Component } from "react";
import { connect } from "react-redux";
import EditProfileImage from "../../components/user-profile/editProfileImage";
import {
  signupPhotographer,
  uploadProfileImage,
} from "../../redux/actions/userActions";
import states from "./states";

const names = ["Linkedin Portrait", "Instagram", "Personal Shoot"];

const CssTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "#23ba8b",
      },
    },
  },
})(TextField);

const styles = (theme) => ({
  ...theme.spreadThis,
  textFieldWidth: {
    margin: "0px auto 15px auto",
    width: "100%",
    textAlign: "left",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  customError: {
    color: "red",
    marginBottom: "15px",
  },
});

class setUpProfile extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      location_city: "",
      location_state: "",
      profileImage: "",
      categories: [],
      photographer: true,
      loading: false,
      errors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      console.log(nextProps.UI.errors);
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handlePhotographerAgree = (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });

    const newPhotographerData = this.state;
    delete newPhotographerData.loading;
    delete newPhotographerData.errors;

    this.props.signupPhotographer(newPhotographerData, this.props.history);
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
    this.props.uploadProfileImage(formData);
  };

  handleEditProfileImage = () => {
    const fileInput = document.getElementById("profileImageInput");
    fileInput.click();
  };

  handleCategoryChanges = (values) => {
    this.setState({
      categories: values,
    });
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
      <div>
        {console.log(errors)}
        <EditProfileImage
          profileImage={this.state.profileImage}
          handleProfileImageChange={this.props.handleProfileImageChange}
          handleEditProfileImage={this.handleEditProfileImage}
        />
        <div style={{ textAlign: "center", padding: "0px 0px 10px 0px" }}>
          <form className={classes.root}>
            <CssTextField
              id="email"
              name="email"
              type="email"
              variant="outlined"
              label="Email"
              className={classes.textFieldWidth}
              color="secondary"
              helperText={errors?.email}
              error={errors?.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
            />

            <CssTextField
              id="password"
              name="password"
              type="password"
              variant="outlined"
              label="Password"
              className={classes.textFieldWidth}
              color="secondary"
              helperText={errors?.password}
              error={errors?.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
            />

            <CssTextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              variant="outlined"
              label="Confirm Password"
              className={classes.textFieldWidth}
              color="secondary"
              helperText={errors?.confirmPassword}
              error={errors?.confirmPassword ? true : false}
              value={this.state.confirmPassword}
              onChange={this.handleChange}
            />

            <CssTextField
              className={classes.textFieldWidth}
              id="firstName"
              variant="outlined"
              name="firstName"
              label="First Name"
              type="text"
              color="secondary"
              helperText={errors?.firstName}
              error={errors?.firstName ? true : false}
              value={this.state.firstName}
              onChange={this.handleChange}
            />

            <CssTextField
              className={classes.textFieldWidth}
              id="lastName"
              variant="outlined"
              name="lastName"
              label="Last Name"
              type="text"
              color="secondary"
              helperText={errors?.lastName}
              error={errors?.lastName ? true : false}
              value={this.state.lastName}
              onChange={this.handleChange}
            />

            <FormControl
              variant="outlined"
              color="secondary"
              className={classes.textFieldWidth}
            >
              <InputLabel>State</InputLabel>
              <Select
                name="location_state"
                id="location_state"
                label="State"
                helperText={errors?.state}
                error={errors?.state ? true : false}
                value={this.state.location_state}
                onChange={this.handleChange}
                MenuProps={{
                  getContentAnchorEl: () => null,
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                }}
              >
                {states.map((state) => (
                  <MenuItem value={state.stateName} key={state.stateName}>
                    {state.stateName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              color="secondary"
              className={classes.textFieldWidth}
            >
              <InputLabel>City</InputLabel>
              <Select
                id="location_city"
                name="location_city"
                label="City"
                helperText={errors?.city}
                error={errors?.city ? true : false}
                value={this.state.location_city}
                onChange={this.handleChange}
                disabled={!this.state.location_state}
                MenuProps={{
                  getContentAnchorEl: () => null,
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                }}
              >
                {this.state.location_state
                  ? states
                      .find(
                        ({ stateName }) =>
                          stateName === this.state.location_state
                      )
                      .cities.map((city) => (
                        <MenuItem value={city.name} key={city.name}>
                          {city.name}
                        </MenuItem>
                      ))
                  : []}
              </Select>
            </FormControl>

            <FormControl
              variant="outlined"
              color="secondary"
              className={classes.textFieldWidth}
            >
              <InputLabel>Categories</InputLabel>
              <Select
                id="categories"
                name="categories"
                label="Categories"
                multiple
                helperText={errors?.categories}
                error={errors?.categories ? true : false}
                value={this.state.categories}
                onChange={this.handleChange}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        color="secondary"
                        key={value}
                        label={value}
                        className={classes.chip}
                        onDelete={this.handleDelete(value)}
                        onMouseDown={(event) => {
                          event.stopPropagation();
                        }}
                      />
                    ))}
                  </div>
                )}
                MenuProps={{
                  getContentAnchorEl: () => null,
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left",
                  },
                }}
              >
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>

          {errors?.general && (
            <Typography variant="body1" className={classes.customError}>
              {errors?.general}
            </Typography>
          )}

          <Button
            color="secondary"
            fullWidth
            variant="contained"
            style={{ height: "40px" }}
            onClick={this.handlePhotographerAgree}
            disabled={loading}
          >
            SIGN UP
            {loading && (
              <CircularProgress
                className={classes.progress}
                color="secondary"
              />
            )}
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, {
  signupPhotographer,
  uploadProfileImage,
})(withStyles(styles)(setUpProfile));
