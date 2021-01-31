import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ToggleButton from "@material-ui/lab/ToggleButton";
import PropTypes from "prop-types";
import React, { Component } from "react";
// Redux
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import AppIcon from "../../images/logo.png";
import {
  signupUser,
  signupPhotographer,
  uploadProfileImage,
} from "../../redux/actions/userActions";
import SetUpProfile from "./signupPhotographer";

const styles = (theme) => ({
  ...theme.spreadThis,
  toggleButton: {
    "&:hover": {
      backgroundColor: "blue",
    },
    "&:selected": {
      backgroundColor: "red",
    },
    "& > :first-child": {
      backgroundColor: "yellow",
    },
  },
  customError: {
    color: "red",
    marginBottom: "15px",
  },
  signUpContainer: {
    [theme.breakpoints.down("sm")]: {
      marginTop: "-90px",
      marginBottom: "0px",
    },
    marginBottom: "80px",
  },
  typeButton: {
    height: "40px",
  },
  buttonGroup: {
    marginBottom: "15px",
  },
  button: {
    marginTop: "0px",
    height: "40px",
  },
  textField: { margin: "0px auto 15px auto" },
});

const StyledToggleButton = withStyles({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    color: "white",
  },
  selected: {
    background: "blue",
    color: "white",
  },
})(ToggleButton);

class signup extends Component {
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
      phoneNumber: "",
      headline: "",
      camera: "",
      instagramHandle: "",
      company: "",
      biography: "",
      categories: [],
      photographer: false,
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

  handleShit = () => {
    this.props.history.push({
      pathname: "/login",
      state: { success: true },
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });

    const newUserData = {
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      photographer: this.state.photographer,
    };

    console.log(newUserData);

    this.props.signupUser(newUserData, this.props.history);
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleToggleChange = (value) => {
    if (value === "photographer") {
      this.setState({
        photographer: true,
        errors: {},
      });
    } else {
      this.setState({
        photographer: false,
      });
    }
  };

  render() {
    if (this.props.authenticated === true) {
      return <Redirect to="/" />;
    }
    const {
      classes,
      UI: { loading },
    } = this.props;
    const { errors } = this.state;
    return (
      <Grid container spacing={2} className={classes.signUpContainer}>
        <Grid item md={2} xs={0} />
        <Grid item md={8} xs={12}>
          <Paper className={classes.auth}>
            <div className={classes.authText}>
              <a href="/">
                <img src={AppIcon} alt="Logo" className={classes.brand} />
              </a>
              <Typography variant="h5" className={classes.authHeader}>
                Welcome to PhotoSpot
              </Typography>
              <Typography varaint="h6" gutterBottom>
                Select a type of account to continue
              </Typography>

              <ButtonGroup
                color="secondary"
                aria-label="outlined primary button group"
                fullWidth
                className={classes.buttonGroup}
              >
                <Button
                  className={classes.typeButton}
                  variant={this.state.photographer ? "outlined" : "contained"}
                  onClick={() => this.handleToggleChange("customer")}
                >
                  Customer
                </Button>
                <Button
                  className={classes.typeButton}
                  variant={this.state.photographer ? "contained" : "outlined"}
                  onClick={() => this.handleToggleChange("photographer")}
                >
                  Photographer
                </Button>
              </ButtonGroup>

              {this.state.photographer ? (
                <SetUpProfile history={this.props.history} />
              ) : (
                <form noValidate onSubmit={this.handleSubmit}>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    variant="outlined"
                    className={classes.textField}
                    color="secondary"
                    helperText={errors.email}
                    error={errors.email ? true : false}
                    value={this.state.email}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    variant="outlined"
                    className={classes.textField}
                    color="secondary"
                    helperText={errors.password}
                    error={errors.password ? true : false}
                    value={this.state.password}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <TextField
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    variant="outlined"
                    className={classes.textField}
                    color="secondary"
                    helperText={errors.confirmPassword}
                    error={errors.confirmPassword ? true : false}
                    value={this.state.confirmPassword}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <TextField
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    type="text"
                    variant="outlined"
                    className={classes.textField}
                    color="secondary"
                    helperText={errors.firstName}
                    error={errors.firstName ? true : false}
                    value={this.state.firstName}
                    onChange={this.handleChange}
                    fullWidth
                  />
                  <TextField
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    type="text"
                    variant="outlined"
                    className={classes.textField}
                    color="secondary"
                    helperText={errors.lastName}
                    error={errors.lastName ? true : false}
                    value={this.state.lastName}
                    onChange={this.handleChange}
                    fullWidth
                  />

                  {errors.general && (
                    <Typography variant="body2" className={classes.customError}>
                      {errors.general}
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
                    Sign up
                    {loading && (
                      <CircularProgress
                        color="secondary"
                        className={classes.progress}
                      />
                    )}
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => this.handleShit()}
                  ></Button>
                </form>
              )}
            </div>
          </Paper>

          <Paper className={classes.bottomAuth}>
            <Button
              component={Link}
              to="/login"
              style={{ textTransform: "none" }}
            >
              Have an account?{" "}
              <span style={{ color: "#23ba8b" }}>&nbsp;Log in</span>
            </Button>
          </Paper>
        </Grid>
        <Grid item md={2} xs={0}></Grid>
      </Grid>
    );
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
  signupPhotographer: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, {
  signupUser,
  signupPhotographer,
  uploadProfileImage,
})(withStyles(styles)(signup));
