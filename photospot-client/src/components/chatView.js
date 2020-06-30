import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";

// Redux
import { connect } from "react-redux";

import {
  ListItemAvatar,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from "@material-ui/core";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class ChatViewComponent extends Component {
  render() {
    const { classes, user, chat } = this.props;

    console.log(user);

    if (chat === undefined) {
      return <main className={classes.content}></main>;
    } else {
      return (
        <div>
          <div></div>
          <main className={classes.content}>
            {chat.messages.map((_msg, _index) => {
              return (
                <div
                  key={_index}
                  className={
                    _msg.sender === this.props.userEmail
                      ? classes.userSent
                      : classes.friendSent
                  }
                >
                  {_msg.message}
                </div>
              );
            })}
          </main>
        </div>
      );
    }
  }
}

export default connect()(withStyles(styles)(ChatViewComponent));
