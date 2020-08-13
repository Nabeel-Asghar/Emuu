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

// Components
import Photographer from "../components/photographer";
import CardSkeleton from "../components/cardSkeleton";

const styles = (theme) => ({
  ...theme.spreadThis,
});

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
          <Paper style={{ padding: "10px 10px 50px 10px" }}>
            <form onSubmit={this.handleSubmit}>
              <TextField
                id="standard-basic"
                name="searchQuery"
                value={this.state.searchQuery}
                onChange={this.handleChange}
                label="Name"
                color="secondary"
              />
              <Button
                variant="contained"
                color="secondary"
                component={Link}
                to={`/search/${this.state.searchQuery}`}
                name="submitSearch"
                style={{ borderRadius: "30px", marginTop: "10px" }}
              >
                Search
              </Button>
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
