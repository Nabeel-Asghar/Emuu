import { Avatar, Box, Hidden, Divider } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import React, { Component } from "react";
import { connect } from "react-redux";

const styles = (theme) => ({
  ...theme.spreadThis,
  root: {
    flexGrow: 1,
  },
  userSent: {
    float: "left",
    textAlign: "left",
    clear: "both",
    padding: "17px",
    marginBottom: "0px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    backgroundColor: "#23ba8b",
    color: "white",
    width: "240px",
    borderRadius: "30px",
  },

  friendSentTimestamp: {
    float: "left",
    textAlign: "left",
    paddingLeft: "16px",
    paddingBottom: "8px",
    color: "gray",
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
    paddingLeft: "0px",
    marginBottom: "0px",
    marginLeft: "8px",
  },

  friendSent: {
    float: "right",
    clear: "both",
    padding: "17px",
    boxSizing: "border-box",
    wordWrap: "break-word",
    marginBottom: "0px",
    backgroundColor: "white",
    color: "black",
    width: "240px",
    borderRadius: "30px",
  },

  userSentTimestamp: {
    float: "right",
    textAlign: "right",
    paddingRight: "16px",
    paddingBottom: "4px",
    color: "gray",
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
    paddingRight: "0px",
    marginBottom: "0px",
    marginRight: "8px",
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
    height: "calc(100vh - 262px);",
    [theme.breakpoints.down(600)]: {
      height: "calc(100vh - 190px);",
    },
    overflow: "auto",
    "&::-webkit-scrollbar": {
      width: "0.4em",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(78,184,141,0.00)",
      webkitBoxShadow: "inset 0 0 6px rgba(78,184,141,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(78,184,141,1)",
      outline: "1px solid rgba(78,184,141,1)",
    },
  },

  boxPadding: {
    paddingBottom: "60px",
    marginBottom: "0px",
  },
});

const moment = require("moment");

class ChatViewComponent extends Component {
  componentDidUpdate = () => {
    const container = document.getElementById("chatview-container");
    if (container) container.scrollTo(0, container.scrollHeight);
  };

  formatDate = (date) => {
    return moment.unix(date / 1000).format("MMM Do, h:mm A");
  };

  formatDateOnlyTime = (date) => {
    return moment.unix(date / 1000).format("LT");
  };

  render() {
    const { classes, userName, chat } = this.props;
    if (chat === undefined) {
      return <main id="chatview-container" className={classes.content} />;
    } else {
      return (
        <div className={classes.root}>
          <div className={classes.chatHeader}>
            {chat.names && chat.names.filter((_usr) => _usr !== userName)[0]}
          </div>
          <Divider />
          <main id="chatview-container" className={classes.chatViewContainer}>
            {chat.messages &&
              chat.messages.map((_msg, _index) => {
                return (
                  <Box flexDirection="column" display="flex">
                    <div>
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
                        <Hidden xsDown>
                          <Box p={1} className={classes.avatar}>
                            <Avatar
                              className={classes.userSentProfileImage}
                              alt="Remy Sharp"
                              src={chat[_msg.sender].profileImage}
                            />
                          </Box>
                        </Hidden>
                        <Box p={1} padding="8px 0px 0px 0px">
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
                      {Date.now() > _msg.timestamp + 28800000
                        ? this.formatDate(_msg.timestamp)
                        : this.formatDateOnlyTime(_msg.timestamp)}
                    </div>
                  </Box>
                );
              })}
          </main>
        </div>
      );
    }
  }
}

export default connect()(withStyles(styles)(ChatViewComponent));
