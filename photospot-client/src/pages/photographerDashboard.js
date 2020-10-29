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

import {
  getStripeStatus,
  refundFromPhotographer,
} from "../redux/actions/paymentActions";

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
import PhotographerReviews from "../components/photographerReviews";
import CollapseItems from "../components/collapse";
import Confirmation from "../components/booking/confirmation";
import Success from "../components/success";

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
      response: "",
      openBackdrop: false,
      selectedIndex: 0,
      newReviewSucess: "",
      type: "edited",
      openRefundDialog: false,
      orderID: "",
      openSuccess: false,
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

  // handle refund
  handleRefundAgree() {
    console.log(this.state.orderID);
    this.props.refundFromPhotographer({ orderID: this.state.orderID });
    this.setState({ openRefundDialog: false, openSuccess: true });
  }

  handleRefundDisagree() {
    this.setState({ openRefundDialog: false });
  }

  handleRefundDialog(orderID) {
    console.log("dialog:", orderID);
    this.setState({ orderID: orderID });
    this.setState({ openRefundDialog: true });
  }

  render() {
    // Redirect if not photographer
    if (this.state.photographer === false) {
      return <Redirect to="/" />;
    }

    // Get photographers current orders
    const userOrders = this.props.userOrders || {};
    let theUserOrders = Object.keys(userOrders).map((key) => (
      <div>
        <OrderCard
          {...this.props}
          key={key}
          photographer={userOrders[key]}
          refundStatus={true}
          handleRefund={this.handleRefundDialog.bind(this)}
        />
      </div>
    ));

    // Get photographers past orders
    const userPastOrders = this.props.userPastOrders || {};
    let theUserPastOrders = Object.keys(userPastOrders).map((key) => (
      <div>
        <OrderCard
          {...this.props}
          key={key}
          photographer={userPastOrders[key]}
          refundStatus={false}
        />
      </div>
    ));

    // Get photographers reviews
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

    // If no current orders return this
    if (theUserPastOrders.length < 1) {
      theUserPastOrders = (
        <Typography variant="subtitle2">You have no past shoots</Typography>
      );
    }

    // If no past orders return this
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

          {!this.props.stripeStatus && <StripeCard />}

          <SettingsCard />
        </Grid>

        <Grid item xs={8}>
          <CollapseItems items={theUserOrders} text="Upcoming Shoots" />

          <CollapseItems items={theUserPastOrders} text="Past Shoots" />

          <CollapseItems items={gridImages} text="Your Reviews" />

          {/* Confirmation for refund */}
          <Confirmation
            open={this.state.openRefundDialog}
            secondaryConfirmation={true}
            handleAgree={this.handleRefundAgree.bind(this)}
            handleDisagree={this.handleRefundDisagree.bind(this)}
            loading={this.props.loading}
            title="Confirm Cancellation of Order"
            text={
              <div>
                <Typography gutterBottom style={{ paddingBottom: "10px" }}>
                  Are you sure you want to cancel this order?
                </Typography>

                <Typography gutterBottom style={{ paddingBottom: "10px" }}>
                  You account will refund the cost of the photo shoot. This
                  cannot be undone.
                </Typography>
              </div>
            }
            label="I understand I want to cancel the order"
          />
          {/* Success after refund */}
          <Success
            body={
              <Typography gutterBottom>
                You refund is being process. This may take a few moments.
              </Typography>
            }
            open={this.state.openSuccess}
            reload={true}
          />
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
  refundFromPhotographer,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(photograhperDashboard));
