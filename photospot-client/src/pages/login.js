import { Snackbar } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
// MUI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Alert from "@material-ui/lab/Alert";
import PropTypes from "prop-types";
import React, { Component } from "react";
// Redux
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import AppIcon from "../images/logo.png";
import { loginUser } from "../redux/actions/userActions";
import OutlinedTextField from "../components/shared/OutlinedTextField";

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
      open: false,
    };
  }

  componentDidMount() {
    this.setState({ open: this.props.location.state?.success });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

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
    const { errors, open } = this.state;

    return (
      <Grid
        container
        align="center"
        justify="center"
        direction="column"
        className={classes.authContainer}
      >
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={open}
          autoHideDuration={5000}
          onClose={this.handleClose}
        >
          <Alert
            variant="outlined"
            onClose={this.handleClose}
            severity="success"
            style={{ backgroundColor: "#23ba8b", color: "white" }}
            classes={{
              icon: {
                color: "white",
                fill: "white",
              },
            }}
          >
            Successfully registered!
          </Alert>
        </Snackbar>

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
                <OutlinedTextField
                  name="email"
                  label="Email"
                  errors={errors?.email}
                  value={this.state.email}
                  handleChange={this.handleChange}
                />

                <OutlinedTextField
                  name="password"
                  label="Password"
                  errors={errors?.password}
                  value={this.state.password}
                  handleChange={this.handleChange}
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
