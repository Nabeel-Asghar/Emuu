import React, { Component } from "react";

//Material UI
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import "../your-photography-page/editBiocss.css";

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
          <div className="container12">
            <ul className="ks-cboxtags">
              <li>
                <input
                  name="Instagram"
                  value="Instagram"
                  type="checkbox"
                  id="checkboxTen"
                  checked={
                    this.props.categories.includes("Instagram") ? true : false
                  }
                  onChange={this.props.handleCatChange}
                />
                <label for="checkboxTen">Instagram</label>
              </li>
              <li>
                <input
                  name="LinkedIn Portrait"
                  type="checkbox"
                  id="checkboxEleven"
                  value="LinkedIn Portrait"
                  checked={
                    this.props.categories.includes("LinkedIn Portrait")
                      ? true
                      : false
                  }
                  onClick={this.props.handleCatChange}
                />
                <label for="checkboxEleven">LinkedIn Portrait</label>
              </li>

              <li>
                <input
                  name="Personal Shoot"
                  type="checkbox"
                  id="checkboxFourteen"
                  checked={
                    this.props.categories.includes("Personal Shoot")
                      ? true
                      : false
                  }
                  value="Personal Shoot"
                  onClick={this.props.handleCatChange}
                />
                <label for="checkboxFourteen">Personal Shoot</label>
              </li>
            </ul>
          </div>
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
