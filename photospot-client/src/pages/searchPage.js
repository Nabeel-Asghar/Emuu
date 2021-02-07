import React, { Component } from "react";
import equal from "fast-deep-equal";
import { Link } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import {
  getPhotographers,
  searchPhotographer,
} from "../redux/actions/dataActions";

// Material UI
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import * as algoliasearch from "algoliasearch";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

// Components
import Photographer from "../components/shared/photographer";
import CardSkeleton from "../components/shared/cardSkeleton";

const styles = (theme) => ({
  ...theme.spreadThis,
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
});

const APP_ID = "SYUBAMS440";
const SEARCH_KEY = "587bf2e2211c20cdb452ed974fbd6b77";

var client = algoliasearch(APP_ID, SEARCH_KEY);
var index = client.initIndex("photographer");

class searchPage extends Component {
  constructor() {
    super();
    this.state = {
      allThePhotographers: {},
      searchQuery: "",
    };
  }
  componentDidMount() {
    this.props.getPhotographers();
    this.setState({ allThePhotographers: this.props.allPhotographers });
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.allPhotographers, prevProps.allPhotographers)) {
      this.setState({ allThePhotographers: this.props.allPhotographers });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const searchQuery = this.state.searchQuery;

    index.search(searchQuery).then(({ hits }) => {
      console.log(hits);
    });

    // this.props.history.push({
    //   pathname: "/search/" + searchQuery,
    //   daSearch: searchQuery,
    // });
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

    let recentPhotographers = Object.keys(
      this.state.allThePhotographers
    ).map((key) => (
      <Photographer
        key={key}
        photographer={this.state.allThePhotographers[key]}
      />
    ));
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Paper style={{ padding: "5px 0px 15px 0px" }}>
            <form onSubmit={this.handleSubmit}>
              <InputBase
                className={classes.input}
                placeholder="Search"
                inputProps={{ "aria-label": "search google maps" }}
                value={this.state.searchQuery}
              />
              <IconButton
                type="submit"
                className={classes.iconButton}
                aria-label="search"
              >
                <SearchIcon />
              </IconButton>
              {/* <TextField
                id="standard-basic"
                name="searchQuery"
                value={this.state.searchQuery}
                label="Name"
                color="secondary"
              />
              <Button
                variant="contained"
                color="secondary"
                name="submitSearch"
                style={{ borderRadius: "30px", marginTop: "10px" }}
              >
                Search
              </Button> */}
            </form>
          </Paper>
        </Grid>

        {loading ? <CardSkeleton /> : recentPhotographers}
      </Grid>
    );
  }

  selectChat = (chatIndex) => {
    console.log("index", chatIndex);
    this.setState({ selectedChat: chatIndex });
  };

  newChatBtnClicked = () =>
    this.setState({ newChatFormVisible: true, selectChat: null });
}
const mapStateToProps = (state) => ({
  allPhotographers: state.data.allPhotographers,
  allSearchPhotographer: state.data.searchPhotographer,
  UI: state.UI,
});

const mapActionsToProps = {
  getPhotographers,
  searchPhotographer,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(searchPage));
