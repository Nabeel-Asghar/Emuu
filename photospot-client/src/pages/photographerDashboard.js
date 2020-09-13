import React, { Component } from "react";
import moment from "moment";
import { Redirect, Link } from "react-router-dom";
import equal from "fast-deep-equal";

// Redux
import { connect } from "react-redux";
import {
  getUserData,
  uploadProfileImage,
  getPhotographerOrders,
  getPhotographerPastOrders,
  updateUserProfile,
  getPhotographerReviews,
} from "../redux/actions/userActions";

import { getStripeStatus } from "../redux/actions/paymentActions";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

// components
import OrderCard from "../components/dashboard/orderCard";
import ProfileCard from "../components/dashboard/profileCard";
import ContactCard from "../components/dashboard/contactCard";
import SettingsCard from "../components/dashboard/settingsCard";
import StripeCard from "../components/dashboard/stripeCard";
import CarouselOfItems from "../components/dashboard/carouselOfItems";
import PhotographerReviews from "../components/photographerReviews";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class photograhperDashboard extends Component {
  constructor() {
    super();
    this.state = {
      allReviews: [],
      email: "",
      photographer: true,
      firstName: "",
      lastName: "",
      location_city: "",
      location_state: "",
      profileImage: "",
      createdAt: new Date(),
      activeItemIndex: 0,
    };
  }

  assignStates = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  assignValues(details) {
    if (details) {
      const photoDetails = Object.values(details);

      photoDetails.forEach((task) =>
        Object.entries(task).forEach(([key, value]) => {
          this.assignStates(key, value);
        })
      );
    }
  }

  componentDidMount() {
    this.props.getPhotographerOrders();
    this.props.getPhotographerPastOrders();
    this.props.getUserData().then(() => {
      this.assignValues(this.props.credentials);
    });
    this.props.getStripeStatus();
    this.props.getPhotographerReviews();
    this.setState({
      allReviews: Object.values(this.props.userReviews || {}),
    });
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.userReviews, prevProps.userReviews)) {
      this.setState({
        allReviews: Object.values(this.props.userReviews),
      });
    }
  }

  render() {
    if (this.state.photographer === false) {
      return <Redirect to="/" />;
    }
    const userOrders = this.props.userOrders || {};
    let theUserOrders = Object.keys(userOrders).map((key) => (
      <div>
        <OrderCard key={key} photographer={userOrders[key]} />
      </div>
    ));

    const userPastOrders = this.props.userPastOrders || {};
    let theUserPastOrders = Object.keys(userPastOrders).map((key) => (
      <div>
        <OrderCard key={key} photographer={userPastOrders[key]} />
      </div>
    ));

    //const userReviews = this.props.userReviews || [];
    let gridImages = [];
    for (var key = 0; key < this.state.allReviews.length; key++) {
      gridImages.push(
        <div>
          <PhotographerReviews
            review={this.state.allReviews[key]}
            index={key}
          />
        </div>
      );
    }

    if (theUserPastOrders.length < 1) {
      theUserPastOrders = (
        <Typography variant="subtitle2">You have no past shoots</Typography>
      );
    }

    if (theUserOrders.length < 1) {
      theUserOrders = (
        <Typography variant="subtitle2">You have no upcoming shoots</Typography>
      );
    }

    console.log(this.props.match.params.photographerID);

    const { classes } = this.props;
    return (
      <Grid container spacing={5}>
        <Grid item xs={4}>
          <ProfileCard
            profileImage={this.state.profileImage}
            firstName={this.state.firstName}
            lastName={this.state.lastName}
            formattedDate={moment(this.state.createdAt).format("LL")}
          />

          <ContactCard
            location_city={this.state.location_city}
            location_state={this.state.location_state}
            email={this.state.email}
          />

          {!this.props.stripeStatus && <StripeCard />}

          <SettingsCard />
        </Grid>

        <Grid item xs={8}>
          <Typography variant="h4" style={{ marginTop: "-5px" }}>
            Upcoming Shoots
          </Typography>

          <CarouselOfItems orders={theUserOrders} />

          <Typography variant="h4" style={{ marginTop: "20px" }}>
            Past Shoots
          </Typography>

          <CarouselOfItems orders={theUserPastOrders} />
          {gridImages}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
  userOrders: state.user.userOrders,
  userPastOrders: state.user.userPastOrders,
  stripeStatus: state.payment.stripeStatus,
  userReviews: state.user.userReviews,
});

const mapActionsToProps = {
  getUserData,
  uploadProfileImage,
  getPhotographerOrders,
  getPhotographerPastOrders,
  updateUserProfile,
  getStripeStatus,
  getPhotographerReviews,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(photograhperDashboard));
