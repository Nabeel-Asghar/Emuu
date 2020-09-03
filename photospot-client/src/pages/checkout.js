import React, { Component, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { customerPayment } from "../redux/actions/paymentActions";
import { withRouter, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "./Styling/CardSectionsStyle.css";

// Material UI
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  ...theme.spreadThis,
});

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "20px",
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

const Checkout = (props) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const params = useParams();
  const client_secret = useSelector((state) => state.payment.client_secret);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(customerPayment(params.photographerID));
  }, [params.photographerID]); // Only re-run the effect if count changes

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

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
      setLoading(false);
      setError(result.error.message);
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === "succeeded") {
        setLoading(false);
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
    <Container maxWidth="sm">
      <Paper style={{ padding: 30 }}>
        <form onSubmit={handleSubmit}>
          <label>
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </label>
          <Button
            style={{ marginTop: 10 }}
            fullWidth
            variant="contained"
            color="secondary"
            type="submit"
            disabled={loading}
            disabled={!stripe}
          >
            Pay
            {loading && (
              <CircularProgress
                color="secondary"
                style={{ position: "absolute" }}
              />
            )}
          </Button>
          {error && (
            <Typography style={{ paddingTop: 18, textAlign: "center" }}>
              {error}
            </Typography>
          )}
        </form>
      </Paper>
    </Container>
  );
};

export default withRouter(Checkout);
