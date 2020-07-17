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
} from "../redux/actions/dataActions";

// Photographer
import Photographer from "../components/photographer";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class home extends Component {
  constructor() {
    super();
    this.state = {
      allThePhotographers: {},
      searchQuery: "",
    };
  }
  componentDidMount() {
    let searchQuery = this.props.match.params.searchQuery;
    console.log(searchQuery);
    this.props.searchPhotographer(searchQuery);
    this.setState({ allThePhotographers: this.props.allPhotographers });
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.allPhotographers, prevProps.allPhotographers)) {
      let searchQuery = this.props.match.params.searchQuery;
      console.log(searchQuery);
      this.props.searchPhotographer(searchQuery);
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
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(home));