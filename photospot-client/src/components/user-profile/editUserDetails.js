import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = (theme) => ({
  ...theme.spreadThis,
  root: {
    "& > *": {
      margin: theme.spacing(2),
      width: "23ch",
    },
  },
});

export class editUserDetails extends Component {
  render() {
    const {
      classes,
      firstName,
      lastName,
      location_city,
      location_state,
      phoneNumber,
    } = this.props;

    return (
      <div style={{ textAlign: "center", padding: "10px 0px 10px 0px" }}>
        <form className={classes.root}>
          <TextField
            id="firstName"
            variant="filled"
            name="firstName"
            label="First Name"
            type="text"
            color="secondary"
            value={firstName}
            onChange={this.props.handleChange}
          />

          <TextField
            id="lastName"
            variant="filled"
            name="lastName"
            label="Last Name"
            type="text"
            color="secondary"
            value={lastName}
            onChange={this.props.handleChange}
          />

          <TextField
            id="location_city"
            variant="filled"
            name="location_city"
            label="City"
            type="text"
            color="secondary"
            value={location_city}
            onChange={this.props.handleChange}
          />

          <TextField
            id="location_state"
            variant="filled"
            name="location_state"
            label="State"
            type="text"
            color="secondary"
            value={location_state}
            onChange={this.props.handleChange}
          />

          <TextField
            id="phoneNumber"
            disabled="true"
            variant="filled"
            name="phoneNumber"
            label="Phone Number"
            type="text"
            color="secondary"
            value={phoneNumber}
            onChange={this.props.handleChange}
          />
        </form>
        <Button
          color="secondary"
          variant="contained"
          onClick={this.props.handleAgree}
          disabled={this.props.loading}
        >
          Save Changes
          {this.props.loading && (
            <CircularProgress className={classes.progress} color="secondary" />
          )}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(editUserDetails);