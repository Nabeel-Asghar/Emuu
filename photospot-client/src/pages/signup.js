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

// Redux
import { connect } from "react-redux";
import { signupUser } from "../redux/actions/userActions";

const styles = (theme) => ({
  ...theme.spreadThis,
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

  handleToggleChange = (event, newValue) => {
    if (newValue !== null) {
      this.setState({
        photographer: newValue,
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
      <Grid container className={classes.form}>
        <Paper className={classes.auth}>
          <Grid item xs={9} style={{ margin: "auto" }}>
            <img src={AppIcon} alt="Logo" className={classes.brand} />

            <Typography variant="h5" className={classes.authHeader}>
              Welcome to PhotoSpot
            </Typography>
            <Typography varaint="h6">Create an account to continue</Typography>
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

              <ToggleButtonGroup
                size="small"
                thumbSwitchedStyle={{ background: "green" }}
                name="photographer"
                value={this.state.photographer}
                exclusive
                onChange={this.handleToggleChange}
                style={{ maxWidth: "100%" }}
              >
                <ToggleButton
                  thumbSwitchedStyle={{ background: "green" }}
                  value={true}
                  style={{ width: 200 }}
                >
                  Photographer
                </ToggleButton>
                <ToggleButton
                  thumbSwitchedStyle={{ background: "green" }}
                  value={false}
                  style={{ width: 200 }}
                >
                  Customer
                </ToggleButton>
              </ToggleButtonGroup>

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
          </Grid>
        </Paper>

        <Grid item xs={12}>
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
