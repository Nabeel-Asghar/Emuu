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
  getUsersReviews,
  reviewPhotographer,
} from "../redux/actions/userActions";
import { editReview, deleteReview } from "../redux/actions/dataActions";
import { refund } from "../redux/actions/paymentActions";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import dayjs from "dayjs";
import equal from "fast-deep-equal";
import relativeTime from "dayjs/plugin/relativeTime";

// components
import OrderCard from "../components/dashboard/orderCard";
import ProfileCard from "../components/dashboard/profileCard";
import ContactCard from "../components/dashboard/contactCard";
import ReviewDialog from "../components/photographer-page/reviewDialog";
import ReviewList from "../components/dashboard/reviewList";
import Confirmation from "../components/shared/confirmation";
import Success from "../components/shared/success";
import CollapseItems from "../components/shared/collapse";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class userDashboard extends Component {
  constructor() {
    super();
    this.state = {
      reviews: [],
      email: "",
      firstName: "",
      lastName: "",
      location_city: "",
      location_state: "",
      profileImage: "",
      createdAt: new Date(),
      activeItemIndex: 0,
      open: false,
      errors: {},
      allReviews: [],
      openReview: false,
      title: "",
      rating: 0,
      description: "",
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
    this.props.getUsersOrders();
    this.props.getUsersPastOrders();
    this.props.getUserData().then(() => {
      this.assignValues(this.props.credentials);
    });
    this.props.getUsersReviews();
    this.setState({
      allReviews: Object.values(this.props.reviews || {}),
    });
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.reviews, prevProps.reviews)) {
      this.setState({
        allReviews: Object.values(this.props.reviews),
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({
        errors: nextProps.UI.errors,
      });
    }
    if (nextProps.UI.newReviewSucess) {
      this.handleBackdropOpen();
    }
  }

  // Edit review functions
  handleReviewDialogAgree = (title, description, photographerID, oldRating) => {
    const details = {
      description: description,
      title: title,
      rating: this.state.rating,
      photographerID: photographerID,
      oldRating: oldRating,
    };
    this.props.editReview(details);
  };

  handleDelete = (photographerID, oldRating) => {
    const data = { photographerID: photographerID, oldRating: oldRating };
    this.setState({ type: "deleted" });
    this.props.deleteReview(data);
  };

  handleReviewOpenState = (index) => {
    console.log(index);
    const newRating = this.state.allReviews[index].rating;
    this.setState({
      openReview: true,
      errors: {},
      response: {},
      selectedIndex: index,
      rating: newRating,
    });
  };

  handleDisagree = () => {
    this.setState({
      openReview: false,
      errors: {},
      response: {},
    });
  };

  changeRating = (newRating) => {
    this.setState({
      rating: newRating,
    });
  };

  handleBackdropClose = () => {
    this.setState({
      openBackdrop: !this.state.openBackdrop,
      openReview: false,
    });
    window.location.reload();
  };

  handleBackdropOpen = () => {
    this.setState({
      openBackdrop: true,
    });
  };

  // handle refund
  handleRefundAgree() {
    this.props.refund({ orderID: this.state.orderID });
    this.setState({ openRefundDialog: false, openSuccess: true });
  }

  handleRefundDisagree() {
    this.setState({ openRefundDialog: false });
  }

  handleRefundDialog(orderID) {
    this.setState({ orderID: orderID });
    this.setState({ openRefundDialog: true });
  }

  render() {
    dayjs.extend(relativeTime);
    const {
      UI: { loadingReviewAction, newReviewSucess, loading, fullScreen },
    } = this.props;

    const { errors } = this.state;
    const userOrders = this.props.userOrders || {};

    // Get current order
    let theUserOrders = Object.keys(userOrders).map((key) => (
      <div style={{ marginBottom: 10 }}>
        <OrderCard
          {...this.props}
          key={key}
          photographer={userOrders[key]}
          refundStatus={true}
          handleRefund={this.handleRefundDialog.bind(this)}
        />
      </div>
    ));

    const userPastOrders = this.props.userPastOrders || {};

    // Get user past orders
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

    let gridImages = [];
    for (var key = 0; key < this.state.allReviews.length; key++) {
      gridImages.push(
        <div>
          <ReviewList
            review={this.state.allReviews[key]}
            handleReviewOpenState={this.handleReviewOpenState}
            index={key}
          />
        </div>
      );
    }

    let camp = (
      <ReviewDialog
        openReview={this.state.openReview}
        errors={errors}
        loadingReviewAction={loadingReviewAction}
        newReviewSucess={newReviewSucess}
        handleDisagree={this.handleDisagree}
        handleChange={this.handleChange}
        changeRating={this.changeRating}
        handleBackdropClose={this.handleBackdropClose}
        handleReviewDialogAgree={this.handleReviewDialogAgree}
        handleDelete={this.handleDelete}
        review={this.state.allReviews[this.state.selectedIndex]}
        rating={this.state.rating}
        photographerProfile={
          this.state.allReviews[this.state.selectedIndex]?.photographerProfile
        }
        photographerLastName={
          this.state.allReviews[this.state.selectedIndex]?.photographerLastName
        }
        photographerFirstName={
          this.state.allReviews[this.state.selectedIndex]?.photographerFirstName
        }
        openBackdrop={this.state.openBackdrop}
        type={"Edit Review"}
        deleteBtn={true}
        typeReview={this.state.type}
      />
    );

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

    return (
      <Grid container spacing={5}>
        {/* Left sidebar */}
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
        </Grid>

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
                Are you sure you want to cancel your order?
              </Typography>

              <Typography gutterBottom style={{ paddingBottom: "10px" }}>
                You will only get full refunds on orders cancelled{" "}
                <b>12 hours</b> before the shoot otherwise you will be refunded
                50%. This cannot be undone.
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

        <Grid item md={8} sm={12} xs={12}>
          <CollapseItems text="Upcoming Shoot" items={theUserOrders} />

          <CollapseItems text="Past Shoots" items={theUserPastOrders} />

          <CollapseItems text="Your Reviews" items={gridImages} />

          {camp}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
  userOrders: state.user.userOrders,
  userPastOrders: state.user.userPastOrders,
  reviews: state.user.userReviews,
  UI: state.UI,
  errors: state.UI.errors,
  userReviews: state.user.userReviews,
  payment: state.payment,
});

const mapActionsToProps = {
  getUserData,
  uploadProfileImage,
  getUsersOrders,
  getUsersPastOrders,
  updateUserProfile,
  getUsersReviews,
  reviewPhotographer,
  editReview,
  deleteReview,
  refund,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(userDashboard));
