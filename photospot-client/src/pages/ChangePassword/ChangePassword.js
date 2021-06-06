import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
// MUI
import equal from "fast-deep-equal";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { Component } from "react";

// Redux
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import AppIcon from "../../images/logo.png";
import { changePasswordAction } from "../../redux/actions/userActions";

const styles = (theme) => ({
  ...theme.spreadThis,
  logoImage: {
    borderRadius: "50%",
    marginTop: "30px",
  },
  resetForm: {
    marginTop: "5px",
  },
});

class changePassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      oldPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
      errors: {},
    };
  }

  componentDidMount() {
    this.setState({
      email: this.props.credentials[0]?.email,
    });
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.credentials, prevProps.credentials)) {
      this.setState({
        email: this.props.credentials[0]?.email,
      });
    }
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
      newPassword: this.state.newPassword,
      newPasswordConfirm: this.state.newPasswordConfirm,
      oldPassword: this.state.oldPassword,
    };

    this.props.changePasswordAction(userData, this.props.history);
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
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
            width: "480px",
            margin: "auto",
            paddingBottom: "25px",
            marginTop: 100,
          }}
        >
          <Grid item xs={8} style={{ margin: "auto" }}>
            <img src={AppIcon} alt="Logo" className={classes.logoImage} />
            <Typography variant="h4" className={classes.pageTitle}>
              Change Password
            </Typography>
            <form
              noValidate
              onSubmit={this.handleSubmit}
              className={classes.resetForm}
            >
              <TextField
                id="oldPassword"
                name="oldPassword"
                type="Password"
                error={
                  errors.similar ? true : false || errors.login ? true : false
                }
                helperText={errors.login}
                label="Current Password"
                className={classes.textField}
                value={this.state.oldPassword}
                onChange={this.handleChange}
                variant="outlined"
                color="secondary"
                fullWidth
              />

              <TextField
                id="newPassword"
                name="newPassword"
                type="Password"
                helperText={errors.similar}
                error={
                  errors.similar
                    ? true
                    : false || errors.matching
                    ? true
                    : false
                }
                label="New Password"
                className={classes.textField}
                value={this.state.newPassword}
                onChange={this.handleChange}
                variant="outlined"
                color="secondary"
                fullWidth
              />

              <TextField
                id="newPasswordConfirm"
                name="newPasswordConfirm"
                type="Password"
                helperText={errors.matching}
                error={errors.matching ? true : false}
                label="Re-type new password"
                className={classes.textField}
                value={this.state.newPasswordConfirm}
                onChange={this.handleChange}
                variant="outlined"
                color="secondary"
                fullWidth
              />

              {errors && (
                <Typography variant="body1" className={classes.customError}>
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
                Submit
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

const mapStateToProps = (state) => ({
  user: state.user,
  credentials: state.user.credentials,
  UI: state.UI,
  authenticated: state.user.authenticated,
});

const mapActionsToProps = {
  changePasswordAction,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(changePassword));
