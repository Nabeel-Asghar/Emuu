import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import React, { Component } from "react";
import { connect } from "react-redux";
import OutlinedTextField from "../Shared/OutlinedTextField";
import { signupPhotographer } from "../../redux/actions/userActions";
import { textFields } from "../../util/Constants";
import LocationCity from "./LocationCity";
import LocationState from "./LocationState";

const styles = (theme) => ({
  ...theme.spreadThis,
  textFieldWidth: {
    margin: "0px auto 15px auto",
    width: "100%",
    textAlign: "left",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  customError: {
    color: "red",
    marginBottom: "15px",
  },
});

class signUpPhotographer extends Component {
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
      photographer: true,
      loading: false,
      registration: "not started",
      stripeID: "",
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

  handlePhotographerSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    const newPhotographerData = this.state;
    delete newPhotographerData.loading;
    delete newPhotographerData.errors;

    this.props.signupPhotographer(newPhotographerData, this.props.history);
  };

  handleCategoryChanges = (values) => {
    this.setState({ categories: values });
  };

  handleDelete = (chipToDelete) => () => {
    let categories = this.state.categories;
    this.handleCategoryChanges(
      categories.filter((items) => items !== chipToDelete)
    );
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
          <form>
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

            <LocationState
              classes={classes}
              errors={errors?.state}
              location_state={this.state.location_state}
              handleChange={this.handleChange}
            />

            <LocationCity
              classes={classes}
              errors={errors?.city}
              location_state={this.state.location_state}
              location_city={this.state.location_city}
              handleChange={this.handleChange}
            />
          </form>

          {errors?.general && (
            <Typography variant="body1" className={classes.customError}>
              {errors?.general}
            </Typography>
          )}

          <Button
            color="secondary"
            fullWidth
            variant="contained"
            style={{ height: "40px" }}
            onClick={this.handlePhotographerSubmit}
            disabled={loading}
          >
            SIGN UP
            {loading && (
              <CircularProgress
                className={classes.progress}
                color="secondary"
              />
            )}
          </Button>
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
  signupPhotographer,
})(withStyles(styles)(signUpPhotographer));
