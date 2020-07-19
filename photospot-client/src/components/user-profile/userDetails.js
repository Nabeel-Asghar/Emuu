import React, { Component } from "react";

//Material UI
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

class editBio extends Component {
  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Edit User Details"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="first-name">
            <TextField
              id="standard-first-name"
              name="fakeFirstName"
              type="text"
              label="First Name"
              value={this.props.fname}
              margin="normal"
              variant="outlined"
              onChange={this.props.handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContentText>
          <DialogContentText id="last-name">
            <TextField
              id="standard-last-name"
              name="fakeLastName"
              type="text"
              label="Last Name"
              value={this.props.lname}
              margin="normal"
              variant="outlined"
              onChange={this.props.handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContentText>

          <DialogContentText id="city">
            <TextField
              id="standard-city"
              name="fakeCity"
              type="text"
              label="City"
              value={this.props.city}
              margin="normal"
              variant="outlined"
              onChange={this.props.handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContentText>

          <DialogContentText id="state">
            <TextField
              id="standard-state"
              name="fakeState"
              type="text"
              label="State"
              value={this.props.state}
              margin="normal"
              variant="outlined"
              onChange={this.props.handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.props.handleDisagree}
            variant="contained"
            color="secondary"
          >
            Close
          </Button>
          <Button
            onClick={this.props.handleAgree}
            variant="contained"
            color="primary"
            autoFocus
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default editBio;
