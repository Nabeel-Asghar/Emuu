import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import BusinessIcon from "@material-ui/icons/Business";
import InstagramIcon from "@material-ui/icons/Instagram";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { Component } from "react";
import firebase from "../../firestore";
import NewChatComponent from "../messaging/newChat";

const styles = (theme) => ({
  ...theme.spreadThis,
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
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      email: newProps.email,
      userEmail: newProps.userEmail,
      profileImage: newProps.profileImage,
      userProfileImage: newProps.userProfileImage,
    });
    console.log(this.state);
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
      <Grid container>
        <Grid item xs={12}>
          {loading ? (
            <Skeleton
              variant="rect"
              className={classes.background}
              width={1000}
              height={200}
            />
          ) : (
            <img className={classes.background} src={background} />
          )}
        </Grid>
        <Grid item xs={6}>
          {loading ? (
            <Skeleton variant="rect" className={classes.avatar} />
          ) : (
            <img className={classes.avatar} src={profileImage} />
          )}
        </Grid>
        <Grid item xs={6} className={classes.rightGrid}>
          {loading ? (
            <Skeleton>
              <Typography variant="h3">Book</Typography>
            </Skeleton>
          ) : (
            <div>
              <Button
                className={classes.bookButton}
                disabled={loading}
                variant="outlined"
                color="secondary"
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
                variant="contained"
                color="secondary"
                disableElevation
                onClick={this.handleContactClickOpen}
              >
                <Typography style={{ fontWeight: "bold" }}>Contact</Typography>
              </Button>
              <NewChatComponent
                email={email}
                open={this.state.open}
                goToChatFn={this.goToChat}
                newChatSubmitFn={this.newChatSubmit}
              ></NewChatComponent>
            </div>
          )}
        </Grid>

        <Grid item xs={8}>
          <div className={classes.textGrid}>
            <Typography variant="h4">
              {loading ? (
                <Skeleton width="25%" />
              ) : (
                <div>
                  {firstName} {lastName}
                </div>
              )}
            </Typography>

            <Typography variant="h6">
              {loading ? <Skeleton width="25%" /> : <div>{headline}</div>}
            </Typography>

            <Typography variant="subtitle1">
              {loading ? (
                <Skeleton width="25%" />
              ) : (
                <div>
                  {location_city}, {location_state}
                </div>
              )}
            </Typography>
          </div>
        </Grid>

        <Grid item xs={4}>
          <div style={{ width: "100%" }}>
            <List dense="true">
              <ListItem>
                <ListItemText primary={camera} style={{ textAlign: "right" }} />
                <ListItemSecondaryAction>
                  <a
                    target="_blank"
                    href={`https://www.google.com/search?q=${camera}`}
                  >
                    <IconButton edge="end" aria-label="icon">
                      <PhotoCameraIcon color="secondary" />
                    </IconButton>
                  </a>
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={instagram}
                  style={{ textAlign: "right" }}
                />
                <ListItemSecondaryAction>
                  <a
                    target="_blank"
                    href={`http://www.instagram.com/${instagram}`}
                  >
                    <IconButton edge="end" aria-label="icon">
                      <InstagramIcon color="secondary" />
                    </IconButton>
                  </a>
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem>
                <ListItemText
                  primary={company}
                  style={{ textAlign: "right" }}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="icon">
                    <BusinessIcon color="secondary" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </div>
        </Grid>
      </Grid>
    );
  }

  handleContactClickOpen = () => {
    this.setState({
      open: true,
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
