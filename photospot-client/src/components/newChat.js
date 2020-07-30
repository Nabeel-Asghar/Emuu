import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";

import {
  ListItemAvatar,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Input,
  Divider,
  Paper,
  CssBaseline,
  FormControl,
  InputLabel,
} from "@material-ui/core";

import ChatListComponent from "../components/chatList";
import ChatViewComponent from "../components/chatView";
import ChatTextBoxComponent from "../components/chatTextBox";

// Redux
import { connect } from "react-redux";
import { getPhotographers } from "../redux/actions/dataActions";
import { getChatList } from "../redux/actions/dataActions";
import { sendMessage } from "../redux/actions/dataActions";
import API from "../api";
import equal from "fast-deep-equal";

import firebase from "../firestore";

import styles from "../components/styles";

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
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Send a message!
          </Typography>
          <form
            className={classes.form}
            onSubmit={(e) => this.submitNewChat(e)}
          >
            <FormControl fullWidth>
              <InputLabel htmlFor="new-chat-username">
                Enter your Friend's Email
              </InputLabel>
              <Input
                required
                className={classes.input}
                autoFocus
                onChange={(e) => this.userTyping("username", e)}
                id="new-chat-username"
              ></Input>
            </FormControl>
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
              type="submit"
              fullWidth
              className={classes.submit}
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </form>
        </Paper>
      </main>
    );
  }

  userTyping = (type, e) => {
    switch (type) {
      case "username":
        this.setState({ username: e.target.value });
        break;

      case "message":
        this.setState({ message: e.target.value });
        break;

      default:
        break;
    }
  };

  submitNewChat = async (e) => {
    e.preventDefault();
    const userExists = await this.userExists();
    if (userExists) {
      const chatExists = await this.chatExists();
      chatExists ? this.goToChat() : this.createChat();
    }
  };

  createChat = () => {
    this.props.newChatSubmitFn({
      sendTo: this.state.username,
      message: this.state.message,
    });
  };

  goToChat = () =>
    this.props.goToChatFn(this.buildDocKey(), this.state.message);

  chatExists = async () => {
    const docKey = this.buildDocKey();
    const chat = await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .get();

    console.log(chat.exists);
    return chat.exists;
  };

  buildDocKey = () => {
    return ["adeelasghar1001@gmail.com", this.state.username].sort().join(":");
  };

  userExists = async () => {
    const usersSnapshot = await firebase.firestore().collection("users").get();
    const exists = usersSnapshot.docs
      .map((_doc) => _doc.data().email)
      .includes(this.state.username);

    //this.setState({ serverError: !exists });

    return exists;
  };
}

export default withStyles(styles)(NewChatComponent);
