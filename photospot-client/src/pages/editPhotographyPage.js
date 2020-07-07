/*
1. Get users current details
2. Have form to fill in those details
3. Form fields must be pre-filled in if value for that field is already in database
4. With any new changes, submit to backend 
*/
import React, { Component } from "react";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";

// Redux
import { connect } from "react-redux";
import { getYourPhotographyPage } from "../redux/actions/userActions";

import equal from "fast-deep-equal";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class editPhotographyPage extends Component {
  constructor() {
    super();
    this.state = {
      background: "",
      profileImage: "",
      images: [],
      bio: "",
      location_city: "",
      location_state: "",
      company: "",
      instagram: "",
      website: "",
      ratePerHour: "",
    };
  }

  assignStates = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  assignValues(details) {
    const photoDetails = Object.values(details);

    photoDetails.forEach((task) =>
      Object.entries(task).forEach(([key, value]) => {
        this.assignStates(key, value);
      })
    );
  }

  componentDidMount() {
    // Get the users current details
    this.props.getYourPhotographyPage().then(() => {
      this.assignValues(this.props.yourPhotographerPage);
    });
  }

  componentDidUpdate(prevProps) {
    if (
      !equal(this.props.yourPhotographerPage, prevProps.yourPhotographerPage)
    ) {
      this.props.getYourPhotographyPage().then(() => {
        this.assignValues(this.props.yourPhotographerPage);
        console.log(this.props.yourPhotographerPage);
      });
    }
  }

  render() {
    return <div>hello</div>;
  }
}

const mapStateToProps = (state) => ({
  yourPhotographerPage: state.user.yourPhotographyPageDetails,
});

const mapActionsToProps = {
  getYourPhotographyPage,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(editPhotographyPage));
