import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import AppIcon from "../images/logo.png";
import photo1 from "../images/photo1.png";
import photo2 from "../images/photo2.png";
import photo3 from "../images/photo3.png";
import { withRouter, Link } from "react-router-dom";

import { connect } from "react-redux";
import { applyFilters } from "../redux/actions/dataActions";

// Material UI
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

const styles = (theme) => ({
  ...theme.spreadThis,

  homeContainer: {
    margin: "60px -20px 0 -20px",
    backgroundColor: "white",
  },

  homeGrid: {
    textAlign: "center",
    backgroundImage: `url(${require("../images/background.jpg")})`,
    backgroundSize: "cover",
    padding: "0px",
  },
  welcomeText: {
    color: "white",
    paddingTop: "50px",
  },
  introText: {
    color: "white",
  },
  margin: {
    margin: theme.spacing(1),
  },
  subtitleText: {
    margin: "20px 0 -20px 0",
  },
  subtitleText1: {
    margin: "-20px 0 -20px 0",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: "200px",
  },
  formControl1: {
    margin: theme.spacing(1),
    minWidth: "150px",
    margin: "-2px 0 0 0",
  },

  photoGrid: {
    textAlign: "center",
    marginTop: "50px",
    backgroundColor: "rgb(245, 245, 245)",
    paddingTop: "25px",
  },
});

class homePage extends Component {
  constructor() {
    super();
    this.state = {
      allThePhotographers: {},
      searchQuery: "",
      type: "",
      city: "",
      state: "",
    };
  }

  handleFilterSubmit = (event) => {
    event.preventDefault();

    const type = this.state.type;
    const city = this.state.city;
    const state = this.state.state;

    this.props.history.push({
      pathname: "/search/" + type + "/" + city + "/" + state,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const searchQuery = this.state.searchQuery;
    this.props.history.push({
      pathname: "/search/" + searchQuery,
      daSearch: searchQuery,
    });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.homeContainer}>
        <Grid container className={classes.homeGrid} spacing={5}>
          <Grid item xs={12}>
            <Typography variant="h4" className={classes.welcomeText}>
              Welcome to PhotoSpot
            </Typography>
            <Typography variant="h2" className={classes.introText}>
              Hire photographers and <br />
              videographers at any price
            </Typography>
          </Grid>
          <Grid item xs={3} />
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              className={classes.margin}
              component={Link}
              to="/signup"
            >
              Signup
            </Button>

            <Button
              variant="contained"
              color="secondary"
              size="large"
              className={classes.margin}
              component={Link}
              to="/login"
            >
              Login
            </Button>
          </Grid>
          <Grid item xs={3} />
        </Grid>
        <Grid container className={classes.centerGrid} spacing={5}>
          <Grid item xs={3} />
          <Grid item xs={6}>
            <Typography variant="h6" className={classes.subtitleText}>
              Search for photographers in your area
            </Typography>
          </Grid>
          <Grid item xs={3} />
          <Grid item xs={3} />
          <Grid item xs={6}>
            <form
              onSubmit={this.handleFilterSubmit}
              className={classes.formControl1}
              noValidate
              autoComplete="off"
            >
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Shoot Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  label="Shoot Type"
                  name="type"
                  value={this.state.type}
                  onChange={this.handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"Instagram"}>Instagram</MenuItem>
                  <MenuItem value={"LinkedIn Portrait"}>
                    LinkedIn Portrait
                  </MenuItem>
                  <MenuItem value={"Personal Shoot"}>Personal Shoot</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="city">City</InputLabel>
                <Select
                  labelId="city"
                  id="city"
                  name="city"
                  label="City"
                  value={this.state.city}
                  onChange={this.handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value={"Troy"}>Troy</MenuItem>
                  <MenuItem value={"Rochester Hills"}>Rochester Hills</MenuItem>
                  <MenuItem value={"Auburn Hills"}>Auburn Hills</MenuItem>
                </Select>
              </FormControl>

              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="state">State</InputLabel>
                <Select
                  labelId="state"
                  id="state"
                  label="state"
                  name="state"
                  value={this.state.state}
                  onChange={this.handleChange}
                >
                  <MenuItem value={"MI"}>Michigan</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                color="primary"
                name="submitSearch"
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Grid>
          <Grid item xs={3} />
          <Grid item xs={3} />
          <Grid item xs={6}>
            <Typography variant="h6" className={classes.subtitleText1}>
              ...Or search for your favorite photographer
            </Typography>
          </Grid>
          <Grid item xs={3} />
          <Grid item xs={3} />
          <Grid item xs={6}>
            <form
              onSubmit={this.handleSubmit}
              className={classes.formControl1}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                name="searchQuery"
                value={this.state.searchQuery}
                onChange={this.handleChange}
              />
              <Button
                variant="contained"
                color="primary"
                name="submitSearch"
                type="submit"
              >
                Submit
              </Button>
            </form>
          </Grid>
          <Grid item xs={3} />
        </Grid>
        <Grid container spacing={3} className={classes.photoGrid}>
          <Grid item xs={12} className={classes.centerGrid}>
            <Typography variant="h4">
              Featured photos from photographers near you
            </Typography>
          </Grid>
          <Grid item xs={3} />
          <Grid item xs={2}>
            <img src={photo1} />
          </Grid>
          <Grid item xs={2}>
            <img src={photo2} />
          </Grid>
          <Grid item xs={2}>
            <img src={photo3} />
          </Grid>
          <Grid item xs={3} />
        </Grid>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  allPhotographers: state.data.allPhotographers,
});

const mapActionsToProps = {
  applyFilters,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(homePage));
