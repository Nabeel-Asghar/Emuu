import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import NotificationImportant from "@material-ui/icons/NotificationImportant";

// Redux
import { connect } from "react-redux";
import {
  ListItemAvatar,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from "@material-ui/core";

const styles = (theme) => ({
  ...theme.spreadThis,
  theList: {
    paddingTop: "0px",
    backgroundColor: "white",
    height: " calc(60vh + 110px);",
  },
  newChatBtn: {
    height: "50px",
    borderRadius: "0px",
  },

  listItem: {
    cursor: "pointer",
  },

  unreadMessage: {
    color: "red",
    position: "absolute",
    top: "0",
    right: "5px",
  },

  listItemText: {
    fontWeight: "bold",
  },
});

class UserListComponent extends Component {
  render() {
    const { classes, selectChatFn, chat } = this.props;

    if (!chat || chat.length === 0) {
      return <div>Login in to chat.</div>;
    } else {
      return (
        <main>
          <Button
            variant="contained"
            fullWidth={true}
            color="primary"
            className={classes.newChatBtn}
            onClick={this.newChat}
          >
            New Mesage
          </Button>
          <List className={classes.theList}>
            {chat.map((_chat, _index) => {
              return (
                <div key={_index}>
                  <ListItem
                    onClick={() => selectChatFn(_index)}
                    className={classes.listItem}
                    selected={this.props.selectedChatIndex === _index}
                    alignItems="flex-start"
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt="remy Sharp"
                        src={
                          _chat[
                            _chat.users.filter(
                              (_user) => _user !== this.props.userEmail
                            )[0]
                          ].profileImage
                        }
                      ></Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      classes={{ primary: classes.listItemText }}
                      primary={
                        _chat.users.filter(
                          (_user) => _user !== this.props.userEmail
                        )[0]
                      }
                      secondary={
                        <React.Fragment>
                          <Typography component="span" color="textPrimary">
                            {_chat.messages[
                              _chat.messages.length - 1
                            ].message.substring(0, 30)}
                          </Typography>
                        </React.Fragment>
                      }
                    ></ListItemText>
                    {_chat.receiverHasRead === false &&
                    !this.userIsSender(_chat) ? (
                      <ListItemIcon>
                        <NotificationImportant
                          className={classes.unreadMessage}
                        ></NotificationImportant>
                      </ListItemIcon>
                    ) : null}
                  </ListItem>
                  <Divider />
                </div>
              );
            })}
          </List>
        </main>
      );
    }
  }

  newChat = () => {
    this.props.newChatBtnFunction();
  };

  selectChat = (index) => {
    this.props.selectChatFn(index);
  };

  userIsSender = (chat) =>
    chat.messages[chat.messages.length - 1].sender === this.props.userEmail;
}

export default connect()(withStyles(styles)(UserListComponent));
