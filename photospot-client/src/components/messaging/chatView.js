import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import { sizing } from "@material-ui/system";
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
    padding: "17px",
    marginBottom: "0px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    backgroundColor: "white",
    color: "black",
    width: "300px",
    borderRadius: "30px",
  },

  friendSentTimestamp: {
    float: "left",
    textAlign: "left",
    paddingLeft: "24px",
    paddingBottom: "8px",
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
    padding: "17px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    marginBottom: "0px",
    backgroundColor: "#23ba8b",
    color: "white",
    width: "300px",
    borderRadius: "30px",
  },

  userSentTimestamp: {
    float: "right",
    textAlign: "right",
    paddingRight: "24px",
    paddingBottom: "8px",
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
    "&::-webkit-scrollbar": {
      width: "0.4em",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.5)",
      outline: "1px solid slategrey",
    },
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
    const { classes, userName, chat } = this.props;
    console.log(chat);
    if (chat === undefined) {
      return <main id="chatview-container" className={classes.content} />;
    } else {
      return (
        <div>
          <div className={classes.chatHeader}>
            {chat.names.filter((_usr) => _usr !== userName)[0]}
          </div>
          <main id="chatview-container" className={classes.chatViewContainer}>
            {chat.messages.map((_msg, _index) => {
              return (
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
                        ? classes.userSentTimestamp
                        : classes.friendSentTimestamp
                    }
                  >
                    {this.formatDate(_msg.timestamp)}
                  </div>
                </Box>
              );
            })}
          </main>{" "}
        </div>
      );
    }
  }
}

export default connect()(withStyles(styles)(ChatViewComponent));
