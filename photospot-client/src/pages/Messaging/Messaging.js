import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import equal from "fast-deep-equal";
import React, { Component } from "react";
import { connect } from "react-redux";
import LoadingPage from "../../components/Shared/LoadingPage";
import { firebase } from "../../util/Firestore";
import { getUserData } from "../../redux/actions/userActions";
import ChatTextBoxComponent from "../../components/Messaging/ChatTextBox";
import ChatViewComponent from "../../components/Messaging/ChatView";
import EmptyChat from "../../components/Messaging/EmptyChat";
import UserListComponent from "../../components/Messaging/UserList";

const styles = (theme) => ({
  ...theme.spreadThis,

  messaging: {
    backgroundColor: "white",
    justify: "center",
    border: "1px",
  },

  //Right grid
  ChatList: {
    boxSizing: "border-box",
    overflowY: "hidden",
  },

  messagingContainer: {
    [theme.breakpoints.down(600)]: {
      margin: "-16px -10px -10px -10px",
      border: "0px",
    },
    margin: "0px -10px 0px -10px",
    padding: "0px",
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
      profileImage: "",
      chats: [],
      noChats: true,
      loading: true,
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
      this.setState({ loading: true });
      this.assignValues(this.props.credentials);
      firebase
        .firestore()
        .collection("chats")
        .where("users", "array-contains", this.state.email)
        .onSnapshot((doc) => {
          const chats = doc.docs.map((_doc) => _doc.data());
          chats.sort(function (a, b) {
            return parseFloat(b.timestamp) - parseFloat(a.timestamp);
          });
          if (chats.length == 0) {
            this.setState({
              noChats: false,
              chats: [],
            });
          } else {
            this.setState({
              chats: chats,
              selectedChat: 0,
              noChats: false,
              loading: false,
            });
          }
        });
    });
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.credentials, prevProps.credentials)) {
      this.assignValues(this.props.credentials);
    }
  }

  submitMessage = (msg) => {
    const email = this.state.email;
    const docKey = this.buildDocKey(
      this.state.chats[this.state.selectedChat]?.users.filter(
        (user) => user !== email
      )[0]
    );

    firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .update({
        messages: firebase.firestore.FieldValue.arrayUnion({
          sender: email,
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
    const chats = this.state?.chats;
    const index = this.state?.selectedChat;
    const messages = chats[index]?.messages;

    const docKey = this.buildDocKey(
      chats[index]?.users.filter((user) => user !== this.state.email)[0]
    );

    if (messages && this.clickedChatWhereNotSender(messages)) {
      firebase
        .firestore()
        .collection("chats")
        .doc(docKey)
        .update({ receiverHasRead: true });
    }
  };

  clickedChatWhereNotSender = (messages) =>
    messages[messages.length - 1].sender !== this.state.email;

  selectChat = async (chatIndex) => {
    await this.setState({ selectedChat: chatIndex, newChatFormVisible: false });
    this.messageRead();
  };

  newChatBtnClicked = () =>
    this.setState({ newChatFormVisible: true, selectChat: null });

  render() {
    const { classes } = this.props;
    if (this.state.noChats == true) {
      return <LoadingPage />;
    } else {
      if (this.state.chats?.length === 0) {
        return <EmptyChat classes={classes} />;
      } else {
        return (
          <div className={classes.messagingContainer}>
            <Grid container spacing={0} className={classes.messaging}>
              <Grid item xs={2} sm={4} className={classes.UserList}>
                <UserListComponent
                  history={this.props.history}
                  newChatBtnFunction={this.newChatBtnClicked}
                  selectChatFn={this.selectChat}
                  chat={this.state.chats}
                  userName={this.state.firstName + " " + this.state.lastName}
                  userEmail={this.state.email}
                  selectedChatIndex={this.state.selectedChat}
                />
              </Grid>
              <Grid item xs={10} sm={8} className={classes.ChatList}>
                {this.state.newChatFormVisible ? null : (
                  <ChatViewComponent
                    userEmail={this.state.email}
                    userName={this.state.firstName + " " + this.state.lastName}
                    chat={this.state.chats[this.state.selectedChat]}
                  />
                )}

                {this.state.chats?.length === 0 ? null : (
                  <ChatTextBoxComponent
                    messageReadFn={this.messageRead}
                    submitMessageFn={this.submitMessage}
                  />
                )}
              </Grid>
            </Grid>
          </div>
        );
      }
    }
  }
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
