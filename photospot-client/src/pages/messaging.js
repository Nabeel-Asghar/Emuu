import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";

import ChatListComponent from "../components/chatList";
import ChatViewComponent from "../components/chatView";
import ChatTextBoxComponent from "../components/chatTextBox";
import NewChatComponent from "../components/newChat";

// Redux
import { connect } from "react-redux";
import { getPhotographers } from "../redux/actions/dataActions";
import { getChatList } from "../redux/actions/dataActions";
import { sendMessage } from "../redux/actions/dataActions";
import API from "../api";
import equal from "fast-deep-equal";

import firebase from "../firestore";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class messaging extends Component {
  constructor() {
    super();
    this.state = {
      selectedChat: null,
      newChatFormVisible: false,
      credentials: [],
      email: "adeelasghar1001@gmail.com",
      firstName: "",
      lastName: "",
      bio: "",
      profileImage: "",
      images: [],
      ratePerHour: 0,
      chats: [],
    };
    this.listMessage = [];
  }

  assignStates = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  assignValues(details) {
    const photoDetails = Object.values(details);

    photoDetails.forEach((task) =>
      Object.entries(task).forEach(([key, value]) => {
        this.assignStates(key, value);
      })
    );
  }

  componentDidMount() {
    const credentials = this.props.credentials;
    this.assignValues(credentials);
    let userEmail = this.state.email;
    console.log(credentials);

    firebase
      .firestore()
      .collection("chats")
      .where("users", "array-contains", userEmail)
      .onSnapshot((doc) => {
        const chats = doc.docs.map((_doc) => _doc.data());
        this.setState({ chats: chats });
      });
    console.log(this.state.chats);
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.credentials, prevProps.credentials)) {
      this.assignValues(this.props.credentials);
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid container spacing={3}>
        <Grid item xs={3} className={classes.UserList}>
          <ChatListComponent
            history={this.props.history}
            newChatBtnFunction={this.newChatBtnClicked}
            selectChatFn={this.selectChat}
            chat={this.state.chats}
            userEmail={this.state.email}
            selectedChatIndex={this.state.selectedChat}
          ></ChatListComponent>
        </Grid>
        <Grid item xs={9} className={classes.ChatList}>
          {this.state.newChatFormVisible ? null : (
            <ChatViewComponent
              userEmail={this.state.email}
              chat={this.state.chats[this.state.selectedChat]}
            ></ChatViewComponent>
          )}
          {this.state.selectedChat !== null &&
          !this.state.newChatFormVisible ? (
            <ChatTextBoxComponent
              messageReadFn={this.messageRead}
              submitMessageFn={this.submitMessage}
            ></ChatTextBoxComponent>
          ) : null}
          {this.state.newChatFormVisible ? (
            <NewChatComponent
              goToChatFn={this.goToChat}
              newChatSubmitFn={this.newChatSubmit}
            ></NewChatComponent>
          ) : null}
        </Grid>
      </Grid>
    );
  }

  submitMessage = (msg) => {
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        (_usr) => _usr !== this.state.email
      )[0]
    );
    const sentMessage = { message: msg, email: this.state.email };

    firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: this.state.email,
          message: msg,
          timestamp: Date.now(),
        }),
        receiverHasRead: false,
      });
  };

  buildDocKey = (friend) => [this.state.email, friend].sort().join(":");

  messageRead = () => {
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat].users.filter(
        (_usr) => _usr !== this.state.email
      )[0]
    );
    if (this.clickedChatWhereNotSender(this.state.selectedChat)) {
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ receiverHasRead: true });
    } else {
      console.log("Cliked message where user was the sender");
    }
  };

  goToChat = async (docKey, msg) => {
    const usersInChat = docKey.split(":");
    const chat = this.state.chats.find((_chat) =>
      usersInChat.every((_user) => _chat.users.includes(_user))
    );
    this.setState({ newChatFormVisible: false });
    await this.selectChat(this.state.chats.indexOf(chat));
    this.submitMessage(msg);
  };

  newChatSubmit = async (chatObject) => {
    const docKey = this.buildDocKey(chatObject.sendTo);
    await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .set({
        receiverHasRead: false,
        users: [this.state.email, chatObject.sendTo],
        messages: [{ message: chatObject.message, sender: this.state.email }],
      });
    this.setState({ newChatFormVisible: false });
    this.selectChat(this.state.chats.length - 1);
  };

  clickedChatWhereNotSender = (chatIndex) =>
    this.state.chats[chatIndex].messages[
      this.state.chats[chatIndex].messages.length - 1
    ].sender !== this.state.email;

  selectChat = async (chatIndex) => {
    await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
    this.messageRead();
  };

  newChatBtnClicked = () =>
    this.setState({ newChatFormVisible: true, selectChat: null });
}
const mapStateToProps = (state) => ({
  allPhotographers: state.data.allPhotographers,
  credentials: state.user.credentials,
  allMessages: state.data.allMessages,
});

const mapActionsToProps = {
  getPhotographers,
  getChatList,
  sendMessage,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(messaging));
