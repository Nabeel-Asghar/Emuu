import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import AppIcon from "../images/logo.png";
import photo1 from "../images/photo1.png";
import photo2 from "../images/photo2.png";
import photo3 from "../images/photo3.png";
import photo4 from "../images/photo4.png";
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
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import SearchIcon from "@material-ui/icons/Search";
import Input from "@material-ui/core/Input";
import Box from "@material-ui/core/Box";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import SendIcon from "@material-ui/icons/Send";
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import Fab from "@material-ui/core/Fab";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Slide from "@material-ui/core/Slide";

const styles = (theme) => ({
  ...theme.spreadThis,

  homeContainer: {
    margin: "60px 0",
    backgroundColor: "white",
  },

  homeGrid: {
    textAlign: "center",
    backgroundImage: `url(${require("../images/background1.jfif")})`,
    backgroundSize: "cover",
    padding: "0px 0px 175px 0px",
    minHeight: "100vh",
  },

  paper: {
    padding: "6px 16px",
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },

  root: {
    paddingTop: "20px",
    "& > *": {
      margin: theme.spacing(2),
    },
  },

  introText: {
    color: "white",
  },

  margin: {
    margin: theme.spacing(1),
  },

  formControlLarge: {
    minWidth: "250px",
    float: "left",
  },

  formControlMedium: {
    minWidth: "175px",
    float: "left",
  },

  formControlSmall: {
    minWidth: "100px",
    float: "left",
  },

  photoGrid: {
    textAlign: "center",
    marginTop: "20px",
    backgroundColor: "rgb(245, 245, 245)",
    paddingTop: "25px",
  },

  gridListContainer: {
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

  textContainer: {
    margin: "0 auto 0 auto",
    width: "750px",
    backgroundColor: "white",
    borderRadius: "35px",
  },

  transparentTextContainer: {
    margin: "0 auto 0 auto",
    maxWidth: "600px",
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: "35px",
  },

  textBox: {
    paddingLeft: "10px",
    borderRadius: "35px",
    height: "60px",
    textAlign: "left",
    backgroundColor: "white",
  },

  textBoxName: {
    paddingLeft: "21px",
    borderRadius: "35px",
    height: "60px",
    textAlign: "left",
    paddingTop: "20px",
  },

  textLabel: {
    marginTop: "5px",
    paddingLeft: "12px",
  },
  boldText: {
    fontWeight: "bold",
  },
});

const StyledInput = withStyles((theme) => ({
  focused: {
    backgroundColor: "#dcdcdc",
  },
  underline: {
    border: "0px",
  },
  hover: {
    backgroundColor: "#dcdcdc",
  },
}))(Input);

class home extends Component {
  constructor() {
    super();
    this.state = {
      allThePhotographers: {},
      searchQuery: "",
      type: "",
      city: "",
      state: "",
      tabValue: 0,
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

  handleTabChange = (event, value) => {
    this.setState({
      tabValue: value,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.homeContainer}>
        <Grid container direction="column" className={classes.homeGrid}>
          <Grid item xs={12}>
            <div className={classes.root}>
              <Tabs
                value={this.state.tabValue}
                indicatorColor="secondary"
                textColor="primary"
                onChange={this.handleTabChange}
                aria-label="disabled tabs example"
                centered
              >
                <Tab label={<b>PhotoSpot</b>} />
                <Tab label={<b>FAQ</b>} />
                <Tab label={<b>Contact</b>} />
              </Tabs>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Slide
              direction="up"
              in={this.state.tabValue === 0}
              mountOnEnter
              unmountOnExit
            >
              <div>
                <div className={classes.textContainer}>
                  <form
                    onSubmit={this.handleFilterSubmit}
                    noValidate
                    autoComplete="off"
                  >
                    <FormControl
                      variant="filled"
                      color="secondary"
                      className={classes.formControlLarge}
                    >
                      <InputLabel
                        className={classes.textLabel}
                        inputProps={{ disableUnderline: true }}
                      >
                        Name
                      </InputLabel>
                      <StyledInput
                        className={classes.textBoxName}
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        label="Name"
                        name="searchQuery"
                        value={this.state.searchQuery}
                        onChange={this.handleChange}
                        style={{ marginTop: "0" }}
                        disableUnderline
                      />
                    </FormControl>

                    <FormControl
                      variant="filled"
                      color="secondary"
                      className={classes.formControlLarge}
                    >
                      <InputLabel
                        className={classes.textLabel}
                        id="demo-simple-select-outlined-label"
                      >
                        Shoot Type
                      </InputLabel>
                      <Select
                        className={classes.textBox}
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        label="Shoot Type"
                        name="type"
                        value={this.state.type}
                        onChange={this.handleChange}
                        disableUnderline
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={"Instagram"}>Instagram</MenuItem>
                        <MenuItem value={"LinkedIn Portrait"}>
                          LinkedIn Portrait
                        </MenuItem>
                        <MenuItem value={"Personal Shoot"}>
                          Personal Shoot
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl
                      variant="filled"
                      color="secondary"
                      className={classes.formControlMedium}
                      style={{ float: "left" }}
                    >
                      <InputLabel id="city" className={classes.textLabel}>
                        City
                      </InputLabel>
                      <Select
                        className={classes.textBox}
                        labelId="city"
                        id="city"
                        name="city"
                        label="City"
                        value={this.state.city}
                        onChange={this.handleChange}
                        disableUnderline
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={"Troy"}>Troy</MenuItem>
                        <MenuItem value={"Rochester Hills"}>
                          Rochester Hills
                        </MenuItem>
                        <MenuItem value={"Auburn Hills"}>Auburn Hills</MenuItem>
                      </Select>
                    </FormControl>

                    <Fab
                      color="secondary"
                      onClick={
                        this.state.type.length == 0
                          ? this.handleSubmit
                          : this.handleFilterSubmit
                      }
                      style={{ margin: "2px 0px 2px 15px" }}
                    >
                      <SearchIcon />
                    </Fab>
                  </form>
                </div>
                <Box
                  p={1}
                  style={{
                    maxWidth: 400,
                    margin: "150px auto",
                    padding: "10px",
                  }}
                >
                  <Typography variant="h2" className={classes.introText}>
                    TAKE A SHOT
                  </Typography>
                  <Button fullWidth color="primary" variant="outlined">
                    <Typography variant="h6">Shoot nearby</Typography>
                  </Button>
                </Box>
              </div>
            </Slide>

            <Slide
              direction="up"
              in={this.state.tabValue === 1}
              mountOnEnter
              unmountOnExit
            >
              <Paper
                className={classes.transparentTextContainer}
                style={{ textAlign: "left", padding: "20px" }}
              >
                <Typography className={classes.boldText}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit?
                </Typography>
                <Typography gutterBottom>
                  Pellentesque egestas sed lectus ac maximus. Integer nec mi eu
                  ex venenatis gravida. In interdum sit amet orci ac dictum.{" "}
                </Typography>
                <Typography className={classes.boldText}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit?
                </Typography>
                <Typography gutterBottom>
                  Pellentesque egestas sed lectus ac maximus. Integer nec mi eu
                  ex venenatis gravida. In interdum sit amet orci ac dictum.{" "}
                </Typography>

                <Typography className={classes.boldText}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit?
                </Typography>
                <Typography gutterBottom>
                  Pellentesque egestas sed lectus ac maximus. Integer nec mi eu
                  ex venenatis gravida. In interdum sit amet orci ac dictum.{" "}
                </Typography>
                <Typography className={classes.boldText}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit?
                </Typography>
                <Typography gutterBottom>
                  Pellentesque egestas sed lectus ac maximus. Integer nec mi eu
                  ex venenatis gravida. In interdum sit amet orci ac dictum.{" "}
                </Typography>
                <Typography className={classes.boldText}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit?
                </Typography>
                <Typography gutterBottom>
                  Pellentesque egestas sed lectus ac maximus. Integer nec mi eu
                  ex venenatis gravida. In interdum sit amet orci ac dictum.{" "}
                </Typography>
              </Paper>
            </Slide>

            <Slide
              direction="up"
              in={this.state.tabValue === 2}
              mountOnEnter
              unmountOnExit
            >
              <Paper className={classes.transparentTextContainer}>
                <Typography className={classes.boldText}>Email</Typography>
                <Typography gutterBottom>admin@photospot.site </Typography>
                <Typography className={classes.boldText}>Phone</Typography>
                <Typography gutterBottom>(248) 453-4661</Typography>
              </Paper>
            </Slide>
          </Grid>
        </Grid>

        <Grid container justify="center">
          <div
            style={{
              width: 1000,
              margin: "auto",
              padding: "60px 20px 60px 20px",
            }}
          >
            <Grid item xs={12}>
              <Typography
                variant="h4"
                style={{ padding: "20px 0 20px 0", textAlign: "center" }}
              >
                How does it work?
              </Typography>
              <Timeline align="alternate">
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot>
                      <AssignmentTurnedInIcon fontSize="large" />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                      <Typography
                        variant="h6"
                        component="h1"
                        className={classes.boldText}
                      >
                        Sign up
                      </Typography>
                      <Typography variant="h6">
                        Make a completely free account on PhotoSpot
                      </Typography>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="primary">
                      <SearchIcon fontSize="large" />
                    </TimelineDot>
                    <TimelineConnector />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                      <Typography
                        variant="h6"
                        component="h1"
                        className={classes.boldText}
                      >
                        Search
                      </Typography>
                      <Typography variant="h6">
                        Look for any photographer in your area thats fits your
                        needs and book
                      </Typography>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="secondary" variant="outlined">
                      <PhotoCameraIcon fontSize="large" />
                    </TimelineDot>
                    <TimelineConnector className={classes.secondaryTail} />
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                      <Typography
                        variant="h6"
                        component="h1"
                        className={classes.boldText}
                      >
                        Shoot
                      </Typography>
                      <Typography variant="h6">
                        Have fun at your photoshoot! We handle all the annoying
                        payments
                      </Typography>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color="secondary">
                      <SendIcon fontSize="large" />
                    </TimelineDot>
                  </TimelineSeparator>
                  <TimelineContent>
                    <Paper elevation={3} className={classes.paper}>
                      <Typography
                        variant="h6"
                        component="h1"
                        className={classes.boldText}
                      >
                        Recieve
                      </Typography>
                      <Typography variant="h6">
                        Recieve those awesome pictures from the photographer
                      </Typography>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>
            </Grid>
          </div>
        </Grid>

        <Grid container spacing={3} className={classes.photoGrid}>
          <Grid item xs={12} className={classes.centerGrid}>
            <Typography variant="h4">
              Featured photos from photographers on PhotoSpot
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <div className={classes.gridListContainer}>
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

                <GridListTile>
                  <img src={photo4} alt={photo4} />
                  <GridListTileBar
                    title="photo4"
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
const mapStateToProps = (state) => ({
  allPhotographers: state.data.allPhotographers,
  authenticated: state.user.authenticated,
});

const mapActionsToProps = {
  applyFilters,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(home));
