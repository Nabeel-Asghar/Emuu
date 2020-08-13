import React, { Component } from "react";
import { Redirect } from "react-router-dom";
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
import { outerTheme, ThemeProvider } from "./Styling/externalColors";

// Redux
import { connect } from "react-redux";
import { resetPassword } from "../redux/actions/userActions";

const styles = (theme) => ({
  ...theme.spreadThis,
  logoImage: {
    borderRadius: "50%",
    marginTop: "30px",
  },
});

class resetPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      errors: {},
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const userData = {
      email: this.state.email,
    };

    this.props.resetPassword(userData, this.props.history);
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
      <Grid container className={classes.form}>
        <Grid item xs />
        <Paper
          style={{
            maxWidth: "600px",
            margin: "auto",
            paddingBottom: "75px",
            marginTop: 100,
          }}
        >
          <Grid item xs={7} style={{ margin: "auto" }}>
            <img src={AppIcon} alt="Logo" className={classes.logoImage} />
            <Typography variant="h2" className={classes.pageTitle}>
              Login
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
                size="large"
                className={classes.button}
                disabled={loading}
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
          </Grid>
        </Paper>
        <Grid item xs />
      </Grid>
    );
  }
}

const mapActionsToProps = {
  resetPassword,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(resetPassword));
