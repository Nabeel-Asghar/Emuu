import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import equal from "fast-deep-equal";

// Redux
import { connect } from "react-redux";
import {
  getPhotographers,
  searchPhotographer,
  applyFilters,
} from "../redux/actions/dataActions";

// Photographer
import Photographer from "../components/photographer";

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
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    let recentPhotographers = Object.keys(
      this.state.allThePhotographers
    ).map((key) => (
      <Photographer
        key={key}
        photographer={this.state.allThePhotographers[key]}
      />
    ));

    return (
      <Grid container spacing={10}>
        <Grid item sm={3} xs={12}>
          <form onSubmit={this.handleSubmit}>
            <TextField
              id="standard-basic"
              name="searchQuery"
              value={this.state.searchQuery}
              onChange={this.handleChange}
              label="Search photographers"
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
        <Grid item sm={9} xs={12}>
          {recentPhotographers}
        </Grid>
      </Grid>
    );
  }
}
const mapStateToProps = (state) => ({
  allPhotographers: state.data.allPhotographers,
  allSearchPhotographer: state.data.searchPhotographer,
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
