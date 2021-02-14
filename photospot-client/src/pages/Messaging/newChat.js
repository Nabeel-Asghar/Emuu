import { Button, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import React, { Component } from "react";
import "../../components/your-photography-page/editBiocss.css";

const styles = (theme) => ({
  ...theme.spreadThis,
  root: {
    backgroundColor: "red",
  },
  dialogTitle: {
    paddingBottom: "0px",
  },
  box: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  profileAvatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "10px",
  },
  btns: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  deleteBtn: {
    color: theme.palette.getContrastText(theme.palette.error.main),
    background: theme.palette.error.main,
    flex: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class NewChatComponent extends Component {
  constructor() {
    super();
    this.state = {
      username: null,
      message: null,
    };
  }

  render() {
    const {
      classes,
      photographerProfile,
      photographerLastName,
      photographerFirstName,
    } = this.props;
    return (
      <Dialog
        scroll="paper"
        style={{ height: "500px" }}
        TransitionComponent={Transition}
        fullWidth="true"
        maxWidth="sm"
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
          Send a Message
          <IconButton
            edge="end"
            onClick={this.props.handleClose}
            style={{ paddingTop: 0, float: "right" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <div className={classes.box}>
            <img className={classes.profileAvatar} src={photographerProfile} />
            <Typography variant="h5">
              {photographerFirstName} {photographerLastName}
            </Typography>
          </div>

          <Grid container>
            <Grid item xs={12}>
              <DialogContentText id="title">
                <TextField
                  autoComplete="new-password"
                  label="Enter your Message"
                  required
                  onChange={(e) => this.userTyping("message", e)}
                  id="standard-title"
                  color="secondary"
                  type="text"
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </DialogContentText>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Grid container spacing={3}>
            <Grid item xs={12} align="right" className={classes.btns}>
              <Button
                onClick={this.props.handleClose}
                variant="outlined"
                color="secondary"
              >
                <Typography style={{ fontWeight: "bold" }}>Close</Typography>
              </Button>

              <Button
                onClick={this.createChat}
                variant="contained"
                color="secondary"
                autoFocus
              >
                <Typography style={{ fontWeight: "bold" }}>Send</Typography>
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    );
  }

  userTyping = (type, e) => {
    switch (type) {
      case "message":
        this.setState({ message: e.target.value });
        break;

      default:
        break;
    }
  };

  createChat = () => {
    this.props.newChatSubmitFn({
      message: this.state.message,
    });
  };
}

export default withStyles(styles)(NewChatComponent);
