import React, { Component, useEffect } from "react";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import { useSelector, useDispatch } from "react-redux";
import { customerPayment } from "../redux/actions/paymentActions";
import { withRouter, Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "./Styling/CardSectionsStyle.css";

const styles = (theme) => ({
  ...theme.spreadThis,
});

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const params = useParams();
  const client_secret = useSelector((state) => state.payment.client_secret);

  useEffect(() => {
    dispatch(customerPayment(params.photographerID));
  }, [params.photographerID]); // Only re-run the effect if count changes

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    console.log("CHEAT CODE: ", client_secret);

    const result = await stripe.confirmCardPayment(client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Testing",
        },
      },
    });

    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === "succeeded") {
        // Show a success message to your customer
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
        console.log("YESS");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Card details
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </label>
      <button type="submit">Pay</button>
    </form>
  );
};

// const mapStateToProps = (state) => ({
//   client_secret: state.payment.client_secret,
// });

// const mapActionsToProps = {
//   customerPayment,
// };

// export default connect(
//   mapStateToProps,
//   mapActionsToProps
// )(withStyles(styles)(Checkout));
export default withRouter(Checkout);
