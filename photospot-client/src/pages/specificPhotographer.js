// React
import React, { Component } from "react";
import photographer from "../components/photographer";
import Photographer from "../components/photographer";

// Material UI
import Grid from "@material-ui/core/Grid";

// Redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPhotographerPage } from "../redux/actions/dataActions";

class specificPhotographer extends Component {
  state = {
    profile: null,
  };

  componentDidMount() {
    const photographerID = this.props.match.params.photographerID;
    this.props.getPhotographerPage(photographerID);
  }

  render() {
    const photoDetails = this.props.photographerDetails;

    let thePhotographerPage = Object.keys(photoDetails).map((key) => (
      <Photographer key={key} photographer={photoDetails[key]} />
    ));

    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {thePhotographerPage}
        </Grid>
        <Grid item sm={4} xs={12}></Grid>
      </Grid>
    );
  }
}

photographer.PropTypes = {
  getUserData: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  photographerDetails: state.data.photographerPage,
});

const mapActionsToProps = {
  getPhotographerPage,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(specificPhotographer);
