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
});

class ChatListComponent extends Component {
  render() {
    const { classes, selectChatFn, chat } = this.props;

    if (!chat || chat.length === 0) {
      return <div>Login in to chat.</div>;
    } else {
      return (
        <main>
          <Button
            variant="contained"
            fullWidth={false}
            color="primary"
            className={classes.newChatBtn}
            onClick={this.newChat}
          >
            New Mesage
          </Button>
          <List>
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
                      <Avatar alt="remy Sharp">
                        {
                          _chat.users
                            .filter(
                              (_user) => _user !== this.props.userEmail
                            )[0]
                            .split("")[0]
                        }
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
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

export default connect()(withStyles(styles)(ChatListComponent));
