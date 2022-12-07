import {
  Avatar,
  Divider,
  Hidden,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import withStyles from "@material-ui/core/styles/withStyles";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import React, { Component } from "react";
import { connect } from "react-redux";

const styles = (theme) => ({
  ...theme.spreadThis,
  theList: {
    paddingTop: "0px",
    backgroundColor: "white",
    height: "calc(100vh - 200px);",
    [theme.breakpoints.down(600)]: {
      height: "calc(100vh - 128px);",
    },
  },
  newChatBtn: {
    height: "50px",
    fontWeight: "bold",
    borderRadius: "0px",
    lineHeight: "50px",
  },

  listItem: {
    [theme.breakpoints.down(600)]: {
      paddingLeft: "0px",
    },
    paddingRight: "0px",

    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },

  unreadMessage: {
    width: "30px",
    height: "30px",
    position: "absolute",
    top: "0",
    right: "5px",
    margin: "10px 10px 0 0",
    [theme.breakpoints.down(600)]: {
      margin: "0px",
    },
  },

  primaryListItemText: {
    fontWeight: "600",
    overflow: "hidden",
    whiteSpace: "nowrap" /* Don't forget this one */,
    textOverflow: "ellipsis",
  },

  primaryListItemTextUnread: {
    fontWeight: "1000",
    overflow: "hidden",
    whiteSpace: "nowrap" /* Don't forget this one */,
    textOverflow: "ellipsis",
  },
  avatar: {
    margin: "auto",
  },
});

class UserListComponent extends Component {
  render() {
    const { classes, selectChatFn, chat, userName } = this.props;

    return (
      <main>
        <Typography
          component="h1"
          variant="subtitle1"
          align="center"
          className={classes.newChatBtn}
        >
          Chats
        </Typography>
        <Divider />

        <List className={classes.theList}>
          {chat?.map((_chat, _index) => {
            return (
              <div key={_index}>
                <ListItem
                  onClick={() => selectChatFn(_index)}
                  className={classes.listItem}
                  selected={this.props.selectedChatIndex === _index}
                  alignItems="center"
                  style={{ margin: "auto" }}
                >
                  <ListItemAvatar className={classes.avatar}>
                    <Avatar
                      style={{ margin: "auto" }}
                      alt="remy Sharp"
                      src={
                        _chat[
                          _chat.users?.filter(
                            (_user) => _user !== this.props.userEmail
                          )[0]
                        ].profileImage
                      }
                    />
                  </ListItemAvatar>
                  <Hidden xsDown>
                    <ListItemText
                      classes={
                        _chat?.messages &&
                        _chat.receiverHasRead === false &&
                        !this.userIsSender(_chat)
                          ? { primary: classes.primaryListItemTextUnread }
                          : { primary: classes.primaryListItemText }
                      }
                      primary={
                        _chat.names.filter((_user) => _user !== userName)[0]
                      }
                      secondary={
                        <React.Fragment>
                          {_chat.messages && (
                            <Typography component="span" color="textPrimary">
                              {_chat.messages[
                                _chat.messages.length - 1
                              ].message.substring(0, 30)}
                            </Typography>
                          )}
                        </React.Fragment>
                      }
                    />
                  </Hidden>
                  {_chat?.messages &&
                  _chat.receiverHasRead === false &&
                  !this.userIsSender(_chat) ? (
                    <ListItemIcon style={{ width: "40px", height: "40px" }}>
                      <FiberManualRecordIcon
                        color="secondary"
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
    chat?.messages[chat?.messages?.length - 1]?.sender === this.props.userEmail;
}

export default connect()(withStyles(styles)(UserListComponent));