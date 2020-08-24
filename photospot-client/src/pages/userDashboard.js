import React, { Component } from "react";
import moment from "moment";

// Redux
import { connect } from "react-redux";
import {
  getUserData,
  uploadProfileImage,
  getUsersOrders,
  getUsersPastOrders,
  updateUserProfile,
} from "../redux/actions/userActions";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

// components
import OrderCard from "../components/dashboard/orderCard";
import ProfileCard from "../components/dashboard/profileCard";
import ContactCard from "../components/dashboard/contactCard";
import CarouselOfItems from "../components/dashboard/carouselOfItems";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class userDashboard extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
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
    this.props.getUsersOrders();
    this.props.getUsersPastOrders();
    this.props.getUserData().then(() => {
      this.assignValues(this.props.credentials);
    });
  }

  render() {
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
        </Grid>

        <Grid item xs={8}>
          <Typography variant="h4" style={{ marginTop: "-5px" }}>
            Upcoming Shoot
          </Typography>

          <CarouselOfItems orders={theUserOrders} />

          <Typography variant="h4" style={{ marginTop: "20px" }}>
            Past Shoots
          </Typography>
          <CarouselOfItems orders={theUserPastOrders} />
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
  userOrders: state.user.userOrders,
  userPastOrders: state.user.userPastOrders,
});

const mapActionsToProps = {
  getUserData,
  uploadProfileImage,
  getUsersOrders,
  getUsersPastOrders,
  updateUserProfile,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(userDashboard));
