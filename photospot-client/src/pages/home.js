import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";
import { getPhotographers } from "../redux/actions/dataActions";

// Photographer
import Photographer from "../components/photographer";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class home extends Component {
  componentDidMount() {
    this.props.getPhotographers();
  }

  render() {
    const allThePhotographers = this.props.allPhotographers || {};

    let recentPhotographers = Object.keys(allThePhotographers).map((key) => (
      <Photographer key={key} photographer={allThePhotographers[key]} />
    ));

    return (
      <Grid container spacing={10}>
        <Grid item sm={3} xs={12}>
          <p>Search Box</p>
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
});

const mapActionsToProps = {
  getPhotographers,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(home));
