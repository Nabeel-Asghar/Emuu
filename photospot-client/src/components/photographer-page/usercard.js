import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { Component } from "react";
import { firebase } from "../../firestore";
import NewChatComponent from "../../pages/Messaging/newChat";
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
      loading,
      photographer,
    } = this.props;

    return (
      <Grid container className={classes.userCard}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          {loading ? (
            <Skeleton variant="rect" className={classes.avatar} />
          ) : (
            <div className={classes.avatarContainer}>
              <img className={classes.avatar} src={profileImage} />
            </div>
          )}

          {loading ? (
            <Skeleton>
              <Typography variant="h3">Book</Typography>
            </Skeleton>
          ) : (
            <div>
              {console.log("Photographer:", photographer)}
              <Button
                className={classes.spacedButton}
                startIcon={<BookIcon />}
                disabled={loading || photographer}
                variant="outlined"
                color="secondary"
                size="large"
                onClick={() =>
                  this.props.history.push(`${this.props.history.location.pathname}/book`)
                }>
                <Typography style={{ fontWeight: "bold" }}>Book</Typography>
              </Button>
              <Button
                className={classes.spacedButton}
                startIcon={<CallIcon />}
                variant="contained"
                color="secondary"
                disableElevation
                size="large"
                onClick={this.handleContactClickOpen}
                disabled={loading || photographer || !this.props.authenticated}>
                <Typography style={{ fontWeight: "bold" }}>Contact</Typography>
              </Button>
              <NewChatComponent
                email={email}
                photographerProfile={this.state.profileImage}
                photographerLastName={this.props.lastName}
                photographerFirstName={this.props.firstName}
                open={this.state.open}
                handleClose={this.handleContactClickClose}
                goToChatFn={this.goToChat}
                newChatSubmitFn={this.newChatSubmit}
              />
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
    var emails = docKey.split(":");
    var friendEmail = emails[0];
    if (emails[0] == this.state.email) {
      friendEmail = emails[1];
    }

    var userName = this.props.userFirstName + " " + this.props.userLastName;
    var friendName = this.props.firstName + " " + this.props.lastName;

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
          [this.state.email]: { profileImage: this.state.profileImage || "" },
          [friendEmail]: { profileImage: this.state.userProfileImage || "" },
          names: [userName, friendName],
        },
        { merge: true }
      );

    this.setState({ open: false });

    this.goToChat();
  };

  buildDocKey = () => {
    return [this.state.email, this.state.userEmail].sort().join(":");
  };
}

export default withStyles(styles)(usercard);
