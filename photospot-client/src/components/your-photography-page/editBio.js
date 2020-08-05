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
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{"Edit Biography"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              id="standard-full-width"
              name="bio"
              type="text"
              label="Biography"
              value={this.props.bio}
              helperText="Tell us about yourself"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              variant="outlined"
              onChange={this.props.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={this.props.handleDisagree}
            variant="outlined"
            color="secondary"
          >
            Close
          </Button>
          <Button
            onClick={this.props.handleAgree}
            variant="contained"
            color="secondary"
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
