import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
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
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import InputLabel from "@material-ui/core/InputLabel";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import Input from "@material-ui/core/Input";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Slide from "@material-ui/core/Slide";

// Components
import Timeline from "../components/home/timeline";

const styles = (theme) => ({
  ...theme.spreadThis,

  homeContainer: {
    marginTop: "60px",
    backgroundColor: "white",
    overflow: "hidden",
    maxWidth: "100%",
    height: "auto",
  },

  homeGrid: {
    textAlign: "center",
    backgroundImage: `url(${require("../images/background1.jfif")})`,
    backgroundSize: "cover",
    padding: 0,
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
    margin: "0 auto",
    maxWidth: "735px",
    backgroundColor: "white",
    borderRadius: "35px",
  },

  mediumtextContainer: {
    margin: "0 auto",
    maxWidth: "485px",
    backgroundColor: "white",
    borderRadius: "35px",
  },

  smalltextContainer: {
    margin: "0 auto",
    maxWidth: "315px",
    backgroundColor: "white",
    borderRadius: "35px",
  },

  transparentTextContainer: {
    margin: "0 auto ",
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
    backgroundColor: "white",
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
    const { classes, halfScreen, fullScreen } = this.props;

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
                <div
                  className={
                    fullScreen
                      ? classes.smalltextContainer
                      : halfScreen
                      ? classes.mediumtextContainer
                      : classes.textContainer
                  }
                >
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
                    {!halfScreen && (
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
                    )}

                    {!fullScreen && (
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
                          <MenuItem value={"Auburn Hills"}>
                            Auburn Hills
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}

                    <Fab
                      color="secondary"
                      onClick={
                        this.state.type.length == 0
                          ? this.handleSubmit
                          : this.handleFilterSubmit
                      }
                      style={{ margin: "2px 0px" }}
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

        <Timeline fullScreen={fullScreen} />

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
                cols={fullScreen ? 1 : 2}
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
