import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import AppIcon from "../images/logo.png";
import photo1 from "../images/photo1.png";
import photo2 from "../images/photo2.png";
import photo3 from "../images/photo3.png";
import { withRouter, Link } from "react-router-dom";

// Material UI
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";

const styles = (theme) => ({
  ...theme.spreadThis,

  homeContainer: {
    margin: "60px 12px 0 0px",
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

  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    marginLeft: "5px",
    marginRight: "5px",
  },

  gridList: {
    width: 1000,
    height: 1000,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
});

class homePage extends Component {
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
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="demo-simple-select-outlined-label">
                Shoot Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                label="Shoot Type"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Instagram</MenuItem>
                <MenuItem value={20}>LinkedIn Portrait</MenuItem>
                <MenuItem value={30}>Personal Shoot</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="city">City</InputLabel>
              <Select labelId="city" id="city" label="City">
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Troy</MenuItem>
                <MenuItem value={20}>Rochester Hills</MenuItem>
                <MenuItem value={30}>Auburn Hills</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="state">State</InputLabel>
              <Select labelId="state" id="state" label="state">
                <MenuItem value={10}>Michigan</MenuItem>
              </Select>
            </FormControl>
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
              className={classes.formControl1}
              noValidate
              autoComplete="off"
            >
              <TextField id="outlined-basic" label="Name" variant="outlined" />
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

          <Grid item xs={12}>
            <div className={classes.root}>
              <GridList
                cellHeight={475}
                className={classes.gridList}
                style={{ marginTop: "20px" }}
              >
                <GridListTile>
                  <img src={photo1} alt={photo1} />
                  <GridListTileBar
                    title="photo1"
                    subtitle={<span>by: Xile Studios</span>}
                  />
                </GridListTile>

                <GridListTile>
                  <img src={photo2} alt={photo2} />
                  <GridListTileBar
                    title="photo2"
                    subtitle={<span>by: Xile Studios</span>}
                  />
                </GridListTile>

                <GridListTile>
                  <img src={photo3} alt={photo3} />
                  <GridListTileBar
                    title="photo3"
                    subtitle={<span>by: Xile Studios</span>}
                  />
                </GridListTile>
              </GridList>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(homePage);
