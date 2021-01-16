import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import AppIcon from "../images/logo.png";
import Background from "../images/background.jpg";

// MUI
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
import CircularProgress from "@material-ui/core/CircularProgress";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import ButtonGroup from "@material-ui/core/ButtonGroup";

// Redux
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";

const styles = (theme) => ({
  ...theme.spreadThis,
  toggleButton: {
    "&:hover": {
      backgroundColor: "blue",
    },
    "&:selected": {
      backgroundColor: "green",
    },
    "& > :first-child": {
      backgroundColor: "yellow",
    },
  },
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
      photographer: false,
      loading: false,
      errors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

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
      <Grid
        container
        align="center"
        justify="center"
        direction="column"
        className={classes.authContainer}
      >
        <Grid item>
          <Paper className={classes.auth}>
            <div className={classes.authText}>
              <a href="/">
                <img src={AppIcon} alt="Logo" className={classes.brand} />
              </a>
              <Typography variant="h5" className={classes.authHeader}>
                Welcome to PhotoSpot
              </Typography>
              <Typography varaint="h6" gutterBottom>
                Create an account to continue
              </Typography>

              <form noValidate onSubmit={this.handleSubmit}>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
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
                  className={classes.textField}
                  color="secondary"
                  helperText={errors.lastName}
                  error={errors.lastName ? true : false}
                  value={this.state.lastName}
                  onChange={this.handleChange}
                  fullWidth
                />
                <br />
                <br />

                <ButtonGroup
                  color="secondary"
                  aria-label="outlined primary button group"
                  fullWidth
                >
                  <Button
                    variant={this.state.photographer ? "contained" : "outlined"}
                    onClick={() => this.handleToggleChange("photographer")}
                  >
                    Photographer
                  </Button>
                  <Button
                    variant={this.state.photographer ? "outlined" : "contained"}
                    onClick={() => this.handleToggleChange("customer")}
                  >
                    Customer
                  </Button>
                </ButtonGroup>

                {errors.general && (
                  <Typography variant="body2" className={classes.customError}>
                    {errors.general}
                  </Typography>
                )}
                <br />
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  disabled={loading}
                  style={{ marginTop: "20px" }}
                  fullWidth
                >
                  Signup
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
      </Grid>
    );
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps, { signupUser })(
  withStyles(styles)(signup)
);
