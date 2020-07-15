import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";

import ChatListComponent from "../components/chatList";
import ChatViewComponent from "../components/chatView";
import ChatTextBoxComponent from "../components/chatTextBox";

// Redux
import { connect } from "react-redux";
import { getPhotographers } from "../redux/actions/dataActions";
import { getChatList } from "../redux/actions/dataActions";
import { sendMessage } from "../redux/actions/dataActions";

import equal from "fast-deep-equal";

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
      email: "",
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

    this.props.getChatList();
    this.setState({
      chats: Object.values(this.props.allMessages),
    });
  }

  componentDidUpdate(prevProps) {
    console.log("updated");
    if (!equal(this.props.allMessages, prevProps.allMessages)) {
      this.props.getChatList();
      this.setState({
        chats: Object.values(this.props.allMessages),
        credentials: Object.values(this.props.credentials),
      });
    }

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
              submitMessageFn={this.submitMessage}
            ></ChatTextBoxComponent>
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
    this.props.sendMessage(docKey, sentMessage);
  };

  buildDocKey = (friend) => [this.state.email, friend].sort().join(":");

  selectChat = (chatIndex) => {
    console.log("index", chatIndex);
    this.setState({ selectedChat: chatIndex });
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
