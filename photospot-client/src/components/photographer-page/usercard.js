import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { Component } from "react";
import firebase from "../../firestore";
import NewChatComponent from "../messaging/newChat";
import BookIcon from "@material-ui/icons/Book";
import CallIcon from "@material-ui/icons/Call";

const styles = (theme) => ({
  ...theme.spreadThis,
  margin: {
    margin: theme.spacing(1),
  },
});

class usercard extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      email: "",
      userEmail: "",
      userProfileImage: "",
      profileImage: "",
      text: false,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      email: newProps.email,
      userEmail: newProps.userEmail,
      profileImage: newProps.profileImage,
      userProfileImage: newProps.userProfileImage,
    });
  }

  handleHover() {
    this.setState({
      text: true,
    });
  }

  handleOut() {
    this.setState({
      text: false,
    });
  }

  render() {
    const {
      classes,
      firstName,
      lastName,
      email,
      userEmail,
      profileImage,
      background,
      location_city,
      location_state,
      instagram,
      company,
      tags,
      loading,
      headline,
      camera,
      credentials,
    } = this.props;

    return (
      <Grid container style={{ zIndex: 1 }}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          {loading ? (
            <Skeleton variant="rect" className={classes.avatar} />
          ) : (
            <img className={classes.avatar} src={profileImage} />
          )}

          {loading ? (
            <Skeleton>
              <Typography variant="h3">Book</Typography>
            </Skeleton>
          ) : (
            <div>
              <Button
                className={classes.bookButton}
                startIcon={<BookIcon />}
                disabled={loading}
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() =>
                  this.props.history.push(
                    `${this.props.history.location.pathname}/book`
                  )
                }
              >
                <Typography style={{ fontWeight: "bold" }}>Book</Typography>
              </Button>
              <Button
                className={classes.bookButton}
                startIcon={<CallIcon />}
                variant="contained"
                color="secondary"
                disableElevation
                size="large"
                onClick={this.handleContactClickOpen}
              >
                <Typography style={{ fontWeight: "bold" }}>Contact</Typography>
              </Button>
              <NewChatComponent
                email={email}
                open={this.state.open}
                handleClose={this.handleContactClickClose}
                goToChatFn={this.goToChat}
                newChatSubmitFn={this.newChatSubmit}
              ></NewChatComponent>
            </div>
          )}
        </Grid>
      </Grid>
    );
  }

  handleContactClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleContactClickClose = () => {
    this.setState({
      open: false,
    });
  };

  goToChat = () => {
    this.props.history.push({
      pathname: "/messaging/",
    });
  };

  newChatSubmit = async (chatObject) => {
    const docKey = this.buildDocKey();
    console.log(docKey);
    var names = docKey.split(":");
    var friend = names[0];
    let friendProfile;
    if (names[0] == this.state.email) {
      friend = names[1];
    }

    await firebase
      .firestore()
      .collection("chats")
      .doc(docKey)
      .set(
        {
          receiverHasRead: false,
          users: [this.state.email, this.state.userEmail],
          messages: firebase.firestore.FieldValue.arrayUnion({
            message: chatObject.message,
            sender: this.state.userEmail,
            timestamp: Date.now(),
          }),
          timestamp: Date.now(),
          [this.state.email]: { profileImage: this.state.profileImage },
          [friend]: { profileImage: this.state.userProfileImage },
        },
        { merge: true }
      );

    this.setState({ open: false });

    this.goToChat();
  };

  buildDocKey = () => {
    return [this.state.email, this.state.userEmail].sort().join(":");
  };

  // chatExists = async () => {
  //   const docKey = this.buildDocKey();
  //   const chat = await firebase
  //     .firestore()
  //     .collection("chats")
  //     .doc(docKey)
  //     .get();

  //   return chat.exists;
  // };

  //   goToChat = async (docKey, msg) => {
  //   const usersInChat = docKey.split(":");
  //   const chat = this.state.chats.find((_chat) =>
  //     usersInChat.every((_user) => _chat.users.includes(_user))
  //   );
  //   this.setState({ newChatFormVisible: false });
  //   await this.selectChat(this.state.chats.indexOf(chat));
  //   this.submitMessage(msg);
  // };
}

export default withStyles(styles)(usercard);
