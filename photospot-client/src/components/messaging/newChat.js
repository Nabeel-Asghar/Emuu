import {
  Button,
  CssBaseline,
  FormControl,
  Input,
  InputLabel,
  Paper,
  Typography,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import withStyles from "@material-ui/core/styles/withStyles";
import React, { Component } from "react";
import styles from "./styles";

class NewChatComponent extends Component {
  constructor() {
    super();
    this.state = {
      username: null,
      message: null,
    };
  }

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{"Send a message"}</DialogTitle>
        <main className={classes.main}>
          <CssBaseline></CssBaseline>
          <Paper className={classes.paper}>
            <form
              className={classes.form}
              onSubmit={(e) => this.submitNewChat(e)}
            >
              <FormControl fullWidth>
                <InputLabel htmlFor="new-chat-message">
                  Enter your Message
                </InputLabel>
                <Input
                  required
                  className={classes.input}
                  onChange={(e) => this.userTyping("message", e)}
                  id="new-chat-message"
                ></Input>
              </FormControl>
              <Button
                fullWidth
                onClick={this.createChat}
                className={classes.submit}
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
            </form>
          </Paper>
        </main>
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
