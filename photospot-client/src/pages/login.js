import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import AppIcon from "../images/logo.png";

// MUI
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import { outerTheme, ThemeProvider } from "./Styling/externalColors";

// Redux
import { connect } from "react-redux";
import { loginUser } from "../redux/actions/userActions";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
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

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.loginUser(userData, this.props.history);
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
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
        style={{ height: "100vh" }}
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

              <form noValidate onSubmit={this.handleSubmit}>
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  className={classes.textField}
                  helperText={errors.email}
                  error={errors.email ? true : false}
                  value={this.state.email}
                  onChange={this.handleChange}
                  variant="outlined"
                  color="secondary"
                  fullWidth
                />
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  className={classes.textField}
                  helperText={errors.password}
                  error={errors.password ? true : false}
                  value={this.state.password}
                  onChange={this.handleChange}
                  fullWidth
                  variant="outlined"
                  color="secondary"
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
                  size="large"
                  fullWidth
                >
                  Login
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
              to="/signup"
              style={{ textTransform: "none" }}
            >
              Don't have an account?{" "}
              <span style={{ color: "#23ba8b" }}>&nbsp;Sign up</span>
            </Button>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
  authenticated: state.user.authenticated,
});

const mapActionsToProps = {
  loginUser,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(login));
