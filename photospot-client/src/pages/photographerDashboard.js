import React, { Component } from "react";
import moment from "moment";
import { Redirect, Link } from "react-router-dom";
import equal from "fast-deep-equal";

// Redux
import { connect } from "react-redux";
import {
  getYourPhotographyPage,
  uploadProfileImage,
  getPhotographerOrders,
  getPhotographerPastOrders,
  updateUserProfile,
  getPhotographerReviews,
} from "../redux/actions/userActions";

import {
  refundFromPhotographer,
  getBalance,
} from "../redux/actions/paymentActions";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

// components
import DashboardInfo from "../components/dashboard/dashboardInfo";
import OrderCard from "../components/dashboard/orderCard";
import ProfileCard from "../components/dashboard/profileCard";
import ContactCard from "../components/dashboard/contactCard";
import SettingsCard from "../components/dashboard/settingsCard";
import StripeCard from "../components/dashboard/stripeCard";
import PhotographerReviews from "../components/shared/photographerReviews";
import CollapseItems from "../components/shared/collapse";
import Confirmation from "../components/shared/confirmation";
import Success from "../components/shared/success";
import LoadingPage from "../components/shared/loadingPage";

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
      views: 0,
      ratePerHour: 0,
      totalCompletedOrders: 0,
      bookings: 0,
      intialLoading: true,
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

  async componentDidMount() {
    await this.props.getPhotographerOrders();
    await this.props.getPhotographerPastOrders();
    this.props.getYourPhotographyPage().then(() => {
      this.assignValues(this.props.credentials);
      this.getBookingCount();
    });
    await this.props.getPhotographerReviews();
    this.setState({
      allReviews: Object.values(this.props.userReviews || {}),
    });
    this.props.getBalance();
    this.setState({
      intialLoading: false,
    });
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.userReviews, prevProps.userReviews)) {
      this.setState({
        allReviews: Object.values(this.props.userReviews),
      });
      this.getBookingCount();
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

  getBookingCount() {
    let bookings = 0;

    console.log(this.props.userOrders, this.props.userPastOrders);

    this.props.userOrders &&
      Object.keys(this.props.userOrders).map((key) => {
        if (!this.props.userOrders[key].status.includes("Cancel")) {
          bookings += 1;
        }
      });

    this.props.userPastOrders &&
      Object.keys(this.props.userPastOrders).map((key) => {
        if (!this.props.userPastOrders[key].status.includes("Cancel")) {
          bookings += 1;
        }
      });

    this.setState({ bookings });
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
          orderDetails={userOrders[key]}
          consumer={false}
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
          orderDetails={userPastOrders[key]}
          consumer={false}
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

    const { classes, fullScreen } = this.props;
    return (
      <>
        {this.state.intialLoading ? (
          <LoadingPage />
        ) : (
          <Grid
            container
            spacing={2}
            style={{ overflow: "hidden", maxWidth: "100%", margin: "0 auto" }}
          >
            <Grid item md={4} sm={12} xs={12}>
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

              <StripeCard />

              <SettingsCard />
            </Grid>

            <Grid item md={8} sm={12} xs={12}>
              <DashboardInfo
                views={this.state.views}
                totalOrders={this.state.bookings}
                totalRevenue={this.props.balance}
              />
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
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  credentials: state.user.yourPhotographyPageDetails,
  userOrders: state.user.userOrders,
  userPastOrders: state.user.userPastOrders,
  userReviews: state.user.userReviews,
  balance: state.payment.balance,
});

const mapActionsToProps = {
  getYourPhotographyPage,
  uploadProfileImage,
  getPhotographerOrders,
  getPhotographerPastOrders,
  updateUserProfile,
  getPhotographerReviews,
  refundFromPhotographer,
  getBalance,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(photograhperDashboard));
