import { Slide } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React, { Component } from "react";
// Redux
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import OutlinedTextField from "../../components/shared/OutlinedTextField";
import AppIcon from "../../images/logo.png";
import {
  signupPhotographer,
  signupUser,
  uploadProfileImage,
} from "../../redux/actions/userActions";
import SetUpProfile from "./signupPhotographer";

const styles = (theme) => ({
  ...theme.spreadThis,
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

class signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      photographer: false,
      loading: false,
      errors: {},
      registration: true,
    };

    this.textFields = [
      { name: "email", label: "Email" },
      { name: "password", label: "Password" },
      { name: "confirmPassword", label: "Confirm Password" },
      { name: "firstName", label: "First Name" },
      { name: "lastName", label: "Last Name" },
    ];
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      console.log(nextProps.UI.errors);
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({
      loading: true,
    });

    const newUserData = this.state;
    delete newUserData.loading;
    delete newUserData.errors;

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
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={400}>
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
                    {this.textFields.map((item) => {
                      return (
                        <OutlinedTextField
                          name={item.name}
                          label={item.label}
                          errors={errors?.[item.name]}
                          value={this.state[item.name]}
                          handleChange={this.handleChange}
                        />
                      );
                    })}

                    {errors?.general && (
                      <Typography
                        variant="body2"
                        className={classes.customError}
                      >
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
      </Slide>
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
