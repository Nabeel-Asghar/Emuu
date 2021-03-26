import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import React, { Component } from "react";
import { connect } from "react-redux";
import OutlinedTextField from "../../components/shared/OutlinedTextField";
import { signupUser } from "../../redux/actions/userActions";
import { textFields } from "../../util/constants";

const styles = (theme) => ({
  ...theme.spreadThis,
  customError: {
    color: "red",
    marginBottom: "15px",
  },
  button: {
    marginTop: "0px",
    height: "40px",
  },
});

class signUpUser extends Component {
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
      registration: true,
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
    this.setState({ [event.target.name]: event.target.value });
  };

  handleUserSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    const newUserData = this.state;
    delete newUserData.loading;
    delete newUserData.errors;

    this.props.signupUser(newUserData, this.props.history);
  };

  render() {
    const {
      classes,
      UI: { loading },
    } = this.props;
    const { errors } = this.state;
    return (
      <div>
        <div style={{ textAlign: "center", padding: "0px 0px 10px 0px" }}>
          <form noValidate onSubmit={this.handleUserSubmit}>
            {textFields.map((item) => {
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
          </form>
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
  signupUser,
})(withStyles(styles)(signUpUser));
