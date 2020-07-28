import React, { Component } from "react";

//Material UI
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

class editUserDetails extends Component {
  render() {
    return (
      <Dialog
        maxWidth="md"
        open={this.props.open}
        onClose={this.props.handleDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Edit Photographer Profile"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="headline">
            <TextField
              id="standard-headline"
              name="fakeHeadline"
              type="text"
              label="Headline"
              value={this.props.headline}
              margin="normal"
              variant="outlined"
              onChange={this.props.handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContentText>

          <DialogContentText id="camera">
            <TextField
              id="standard-camera"
              name="fakeCamera"
              type="text"
              label="Camera"
              value={this.props.camera}
              margin="normal"
              variant="outlined"
              onChange={this.props.handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContentText>

          <DialogContentText id="instagram">
            <TextField
              id="standard-instagram"
              name="fakeInstagram"
              type="text"
              label="Instagram Handle"
              value={this.props.instagram}
              margin="normal"
              variant="outlined"
              onChange={this.props.handleChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContentText>

          <DialogContentText id="company">
            <TextField
              id="standard-company"
              name="fakeCompany"
              type="text"
              label="Company"
              value={this.props.company}
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

export default editUserDetails;
