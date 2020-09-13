import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import equal from "fast-deep-equal";
import Paper from "@material-ui/core/Paper";

// Redux
import { connect } from "react-redux";
import {
  getPhotographers,
  searchPhotographer,
  applyFilters,
} from "../redux/actions/dataActions";

// Components
import Photographer from "../components/photographer";
import CardSkeleton from "../components/cardSkeleton";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class search extends Component {
  constructor() {
    super();
    this.state = {
      allThePhotographers: {},
      searchQuery: "",
    };
  }

  componentDidMount() {
    if (this.props.match.params.searchQuery) {
      let searchQuery = this.props.match.params.searchQuery;

      this.props.searchPhotographer(searchQuery);
    } else {
      const type = this.props.match.params.type;
      const city = this.props.match.params.city;
      const state = this.props.match.params.state;

      this.props.applyFilters(type, city, state);
    }

    this.setState({ allThePhotographers: this.props.allPhotographers });
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.allPhotographers, prevProps.allPhotographers)) {
      if (this.props.match.params.searchQuery) {
        let searchQuery = this.props.match.params.searchQuery;

        this.props.searchPhotographer(searchQuery);
      } else {
        const type = this.props.match.params.type;
        const city = this.props.match.params.city;
        const state = this.props.match.params.state;

        this.props.applyFilters(type, city, state);
      }

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
    this.props.searchPhotographer(searchQuery);
    this.setState({ allThePhotographers: this.props.allPhotographers });
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const {
      classes,
      UI: { loadingData },
    } = this.props;
    console.log("hello");

    console.log(this.state.allThePhotographers);

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
          <Paper style={{ padding: "10px 0px 15px 0px" }}>
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
                name="submitSearch"
                type="submit"
                style={{ borderRadius: "30px", marginTop: "10px" }}
              >
                Search
              </Button>
            </form>
          </Paper>
        </Grid>

        {loadingData ? <CardSkeleton /> : recentPhotographers}
      </Grid>
    );
  }
}
const mapStateToProps = (state) => ({
  allPhotographers: state.data.allPhotographers,
  allSearchPhotographer: state.data.searchPhotographer,
  UI: state.UI,
});

const mapActionsToProps = {
  getPhotographers,
  searchPhotographer,
  applyFilters,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(search));
