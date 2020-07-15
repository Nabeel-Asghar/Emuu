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
  componentDidUpdate = () => {
    const container = document.getElementById("chatview-container");
    if (container) container.scrollTo(0, container.scrollHeight);
  };

  render() {
    const { classes, userEmail, chat } = this.props;

    if (chat === undefined) {
      return <main id="chatview-container" className={classes.content} />;
    } else {
      return (
        <div>
          <div className={classes.chatHeader}>
            Your conversation with{" "}
            {chat.users.filter((_usr) => _usr !== userEmail)[0]}
          </div>
          <main id="chatview-container" className={classes.chatViewContainer}>
            {chat.messages.map((_msg, _index) => {
              return (
                <div
                  key={_index}
                  className={
                    _msg.sender === this.props.userEmail
                      ? classes.friendSent
                      : classes.userSent
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
