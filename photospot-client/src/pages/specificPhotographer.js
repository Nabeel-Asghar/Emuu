// React
import React, { Component } from "react";
import photographer from "../components/photographer";
import Photographer from "../components/photographer";

// Material UI
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPhotographerPage } from "../redux/actions/dataActions";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class specificPhotographer extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      bio: "",
      profileImage: "",
      images: [],
    };
  }

  assignStates = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  assignValues(details) {
    const formatted = [];

    const photoDetails = Object.values(details);

    photoDetails.forEach((task) =>
      Object.entries(task).forEach(([key, value]) => {
        this.assignStates(key, value);
      })
    );
  }

  componentDidMount() {
    const photographerID = this.props.match.params.photographerID;
    this.props.getPhotographerPage(photographerID);
    const photoDetails = this.props.photographerDetails;
    this.assignValues(photoDetails);
  }

  render() {
    // const photoDetails = this.props.photographerDetails;

    // console.log(formatted[0]);
    // console.log(formatted[1]);
    // console.log(formatted[2]);

    // let thePhotographerPage = Object.keys(photoDetails).map((key) => (
    //   <Photographer key={key} photographer={photoDetails[key]} />
    // ));

    // console.log(thePhotographerPage[0]);

    console.log(this.state.email);

    return (
      <Grid container spacing={10}>
        <Grid item sm={8} xs={12}>
          {/* {thePhotographerPage} */}
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
)(withStyles(styles)(specificPhotographer));
