import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import equal from "fast-deep-equal";
import React, { Component } from "react";
// Redux
import { connect } from "react-redux";
import ChatTextBoxComponent from "../components/messaging/chatTextBox";
import ChatViewComponent from "../components/messaging/chatView";
import NewChatComponent from "../components/messaging/newChat";
import UserListComponent from "../components/messaging/userList";
import firebase from "../firestore";
import { getUserData } from "../redux/actions/userActions";

const styles = (theme) => ({
  ...theme.spreadThis,

  messaging: {
    backgroundColor: "white",
    justify: "center",
    border: "1px",
  },

  //Left Grid
  UserList: {
    marginBottom: "10px",
  },

  //Right grid
  ChatList: {
    marginBottom: "10px",
    boxSizing: "border-box",
    overflowY: "hidden",
  },
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
    this.props.getUserData().then(() => {
      this.assignValues(this.props.credentials);
      console.log(this.state.email);
      firebase
        .firestore()
        .collection("chats")
        .where("users", "array-contains", this.state.email)
        .onSnapshot((doc) => {
          const chats = doc.docs.map((_doc) => _doc.data());
          chats.sort(function (a, b) {
            return parseFloat(b.timestamp) - parseFloat(a.timestamp);
          });
          console.log("abc");
          this.setState({ chats: chats, selectedChat: 0 });
        });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!equal(this.props.credentials, prevProps.credentials)) {
      this.assignValues(this.props.credentials);
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div
        style={{
          border: "2px solid #e6e6e6",
        }}
      >
        <Grid container spacing={0} className={classes.messaging}>
          <Grid item xs={3} className={classes.UserList}>
            <UserListComponent
              history={this.props.history}
              newChatBtnFunction={this.newChatBtnClicked}
              selectChatFn={this.selectChat}
              chat={this.state.chats}
              userEmail={this.state.email}
              selectedChatIndex={this.state.selectedChat}
            ></UserListComponent>
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
      </div>
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
        timestamp: Date.now(),
        receiverHasRead: false,
      });
    this.setState({ selectedChat: 0 });
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
    var names = docKey.split(":");
    var friend = names[0];
    let friendProfile;
    if (names[0] == this.state.email) {
      friend = names[1];
    }
    await firebase
      .firestore()
      .collection("users")
      .where("email", "==", friend)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          friendProfile = doc.data().profileImage;
        });
      });

    console.log(docKey);
    await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .set({
        receiverHasRead: false,
        users: [this.state.email, chatObject.sendTo],
        messages: [{ message: chatObject.message, sender: this.state.email }],
        [this.state.email]: { profileImage: this.state.profileImage },
        [friend]: { profileImage: friendProfile },
      });
    this.setState({ newChatFormVisible: false });
    this.selectChat(this.state.chats.length - 1);
  };

  clickedChatWhereNotSender = (chatIndex) =>
    this.state.chats[chatIndex].messages[
      this.state.chats[chatIndex].messages.length - 1
    ].sender !== this.state.email;

  selectChat = async (chatIndex) => {
    console.log(chatIndex);
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
  authenticated: state.user.authenticated,
});

const mapActionsToProps = {
  getUserData,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(messaging));
