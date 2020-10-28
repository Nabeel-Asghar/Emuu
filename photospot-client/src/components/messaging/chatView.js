import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import { sizing } from "@material-ui/system";
import OnHoverScrollContainer from "./CustomScrollDiv";
// Redux

import { connect } from "react-redux";

import {
  ListItemAvatar,
  Avatar,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from "@material-ui/core";

const styles = (theme) => ({
  ...theme.spreadThis,
  friendSent: {
    float: "left",
    textAlign: "left",
    clear: "both",
    padding: "15px",
    marginBottom: "0px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    backgroundColor: "white",
    color: "black",
    width: "300px",
    borderRadius: "30px",
  },

  friendSentUsername: {
    float: "left",
    textAlign: "left",
    paddingLeft: "24px",
  },

  friendSentProfileImage: {
    height: "55px",
    width: "55px",
    float: "left",
  },

  friendSentBox: {
    flexDirection: "row",
    paddingBottom: "0px",
    backgroundColor: "#e6e6e6",
    paddingTop: "0px",
    marginBottom: "0px",
  },

  userSent: {
    float: "right",
    clear: "both",
    padding: "15px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    marginBottom: "0px",
    backgroundColor: "#23ba8b",
    color: "white",
    width: "300px",
    borderRadius: "30px",
  },

  userSentUsername: {
    float: "right",
    textAlign: "right",
    paddingRight: "24px",
  },

  avatar: {
    paddingBottom: "0px",
    marginBottom: "0px",
  },

  userSentProfileImage: {
    height: "55px",
    width: "55px",
    float: "right",
  },

  userSentBox: {
    flexDirection: "row-reverse",
    paddingBottom: "0px",
    backgroundColor: "#e6e6e6",
    paddingTop: "0px",
    marginBottom: "0px",
  },

  chatHeader: {
    position: "sticky",
    lineHeight: "50px",
    backgroundColor: "white",
    fontSize: "1.5rem",
    height: "50px",
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
    boxSizing: "border-box",
  },

  chatViewContainer: {
    backgroundColor: "#e6e6e6",
    height: "65vh",
    overflow: "auto",
  },

  boxPadding: { paddingBottom: "60px", marginBottom: "0px" },
});

const moment = require("moment");

class ChatViewComponent extends Component {
  componentDidUpdate = () => {
    const container = document.getElementById("chatview-container");
    if (container) container.scrollTo(0, container.scrollHeight);
  };

  formatDate = (date) => {
    var dateString = moment.unix(date / 1000).format("lll");
    return dateString;
  };

  render() {
    const { classes, userEmail, chat } = this.props;

    if (chat === undefined) {
      return <main id="chatview-container" className={classes.content} />;
    } else {
      return (
        <div>
          <div className={classes.chatHeader}>
            {chat.users.filter((_usr) => _usr !== userEmail)[0]}
          </div>
          <main id="chatview-container" className={classes.chatViewContainer}>
            {chat.messages.map((_msg, _index) => {
              return (
                <OnHoverScrollContainer>
                  <Box flexDirection="column" display="flex">
                    <div>
                      {/* <div
                    key={_index}
                    className={
                      _msg.sender === this.props.userEmail
                        ? classes.userSentUsername
                        : classes.friendSentUsername
                    }
                  >
                    {_msg.sender}
                  </div> */}
                      <Box
                        display="flex"
                        p={1}
                        m={1}
                        bgcolor="background.paper"
                        className={
                          _msg.sender === this.props.userEmail
                            ? classes.userSentBox
                            : classes.friendSentBox
                        }
                      >
                        <Box p={1} className={classes.avatar}>
                          <Avatar
                            className={classes.userSentProfileImage}
                            alt="Remy Sharp"
                            src={chat[_msg.sender].profileImage}
                          />
                        </Box>
                        <Box p={1} padding="8px 8px 0px 8px">
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
                        </Box>
                      </Box>
                    </div>

                    <div
                      key={_index}
                      className={
                        _msg.sender === this.props.userEmail
                          ? classes.userSentUsername
                          : classes.friendSentUsername
                      }
                    >
                      {this.formatDate(_msg.timestamp)}
                    </div>
                  </Box>
                </OnHoverScrollContainer>
              );
            })}
          </main>
        </div>
      );
    }
  }
}

export default connect()(withStyles(styles)(ChatViewComponent));
