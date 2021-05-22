import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
// MUI
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
import { resetPasswordAction } from "../../redux/actions/userActions";

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const userData = {
      email: this.state.email,
    };

    this.props.resetPasswordAction(userData, this.props.history);
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
            width: "480px",
            margin: "auto",
            paddingBottom: "25px",
            marginTop: 100,
          }}
        >
          <Grid item xs={7} style={{ margin: "auto" }}>
            <img src={AppIcon} alt="Logo" className={classes.logoImage} />
            <Typography variant="h4" className={classes.pageTitle}>
              Password Reset
            </Typography>
            <Typography variant="h7" className={classes.pageTitle}>
              Enter in your account email
            </Typography>
            <form noValidate onSubmit={this.handleSubmit}>
              <TextField
                id="email"
                name="email"
                type="email"
                helperText={errors.email}
                error={errors.email ? true : false}
                label="Email"
                className={classes.textField}
                value={this.state.email}
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
  UI: state.UI,
  authenticated: state.user.authenticated,
});

const mapActionsToProps = {
  resetPasswordAction,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(resetPassword));
