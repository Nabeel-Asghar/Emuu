import React, { Component } from "react";

//Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

const styles = (theme) => ({
  ...theme.spreadThis,
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "25ch",
  },
});

class editUserDetails extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Dialog
        fullWidth="true"
        maxWidth="sm"
        open={this.props.open}
        onClose={this.props.handleDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Edit Photographer Profile"}
        </DialogTitle>
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <DialogContentText id="headline">
                <TextField
                  id="standard-headline"
                  multiline
                  rows={2}
                  name="fakeHeadline"
                  type="text"
                  label="Headline"
                  value={this.props.headline}
                  margin="normal"
                  variant="outlined"
                  onChange={this.props.handleChange}
                  required
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </DialogContentText>
            </Grid>

            <Grid item xs={6}>
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
            </Grid>

            <Grid item xs={6}>
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
            </Grid>

            <Grid item xs={12}>
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
            </Grid>
          </Grid>
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

export default withStyles(styles)(editUserDetails);
