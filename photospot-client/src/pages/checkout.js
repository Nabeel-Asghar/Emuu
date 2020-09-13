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

// Components
import Success from "../components/checkout/success";
import ProfileCard from "../components/booking/card";
import { timeConvert } from "../util/timeConvert";
import { dateConvert } from "../util/dateConvert";

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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const userDetails = useSelector((state) => state.user.credentials);

  useEffect(() => {
    // Prevent user from checkout without date
    if (!props.location.details || !userDetails[0]) {
      setLoading(true);
      props.history.goBack();
    } else {
      const { userID } = userDetails[0];
      const { email } = userDetails[0];
      const { firstName } = userDetails[0];
      const { lastName } = userDetails[0];
      const { profileImage } = userDetails[0];

      let theDetails = {
        consumerID: userID,
        consumerEmail: email,
        consumerFirstName: firstName,
        consumerLastName: lastName,
        consumerProfileImage: profileImage,
      };

      const orderDetails = { ...theDetails, ...props.location.details };

      dispatch(customerPayment(params.photographerID, orderDetails));
    }
  }, [params.photographerID]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!stripe || !elements) {
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
        setSuccess(true);
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
    <div>
      {props.location.details && (
        <Container maxWidth="sm" style={{ marginBottom: 20 }}>
          {console.log(props.location.details)}
          <ProfileCard
            firstName={props.location.details.photographerFirstName}
            lastName={props.location.details.photographerLastName}
            profileImage={props.location.details.photographerProfileImage}
            date={dateConvert(props.location.details.date)}
            time={timeConvert(props.location.details.time)}
          />
        </Container>
      )}

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
              disabled={!stripe || loading}
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
          <Success open={success} />
        </Paper>
      </Container>
    </div>
  );
};

export default withRouter(Checkout);
