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
  Hidden,
} from "@material-ui/core";

const styles = (theme) => ({
  ...theme.spreadThis,
  theList: {
    paddingTop: "0px",
    backgroundColor: "white",
    height: "calc(100vh - 200px);",
  },
  newChatBtn: {
    height: "50px",
    fontWeight: "bold",
    borderRadius: "0px",
    lineHeight: "50px",
  },

  listItem: {
    [theme.breakpoints.down("sm")]: {
      paddingLeft: "0px",
    },
    paddingRight: "0px",

    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },

  unreadMessage: {
    color: "red",
    position: "absolute",
    top: "0",
    right: "5px",
  },

  listItemText: {
    fontWeight: "bold",
    overflow: "hidden",
    whiteSpace: "nowrap" /* Don't forget this one */,
    textOverflow: "ellipsis",
  },
});

class UserListComponent extends Component {
  render() {
    const { classes, selectChatFn, chat, userName } = this.props;

    console.log(this.props);

    return (
      <main>
        <Typography
          component="h1"
          variant="h6"
          align="center"
          className={classes.newChatBtn}
        >
          Chats
        </Typography>

        <List className={classes.theList}>
          {chat.map((_chat, _index) => {
            return (
              <div key={_index}>
                <ListItem
                  onClick={() => selectChatFn(_index)}
                  className={classes.listItem}
                  selected={this.props.selectedChatIndex === _index}
                  alignItems="center"
                  style={{ margin: "auto" }}
                >
                  <ListItemAvatar style={{ margin: "auto" }}>
                    <Avatar
                      style={{ margin: "auto" }}
                      alt="remy Sharp"
                      src={
                        _chat[
                          _chat.users.filter(
                            (_user) => _user !== this.props.userEmail
                          )[0]
                        ].profileImage
                      }
                    />
                  </ListItemAvatar>
                  <Hidden xsDown>
                    <ListItemText
                      classes={{ primary: classes.listItemText }}
                      primary={
                        _chat.names.filter((_user) => _user !== userName)[0]
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
                    />
                  </Hidden>
                  {_chat.receiverHasRead === false &&
                  !this.userIsSender(_chat) ? (
                    <ListItemIcon>
                      <NotificationImportant
                        className={classes.unreadMessage}
                      />
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
