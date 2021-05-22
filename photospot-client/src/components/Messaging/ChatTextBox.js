import { Box } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import SendIcon from "@material-ui/icons/Send";
import React, { Component } from "react";
// Redux
import { connect } from "react-redux";

const styles = (theme) => ({
  ...theme.spreadThis,

  root: { marginTop: "10px", marginBottom: "10px" },
  paper: {
    boxShadow: "none",
    backgroundColor: "#e6e6e6",
    padding: "10px",
    display: "flex",
    marginRight: "5px",
    alignItems: "center",
    borderRadius: "30px",
  },
  boxStyle: {
    padding: "0px",
    marginRight: "2px",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
    color: "secondary",
  },
});

class ChatTextBoxComponent extends Component {
  constructor() {
    super();
    this.state = {
      chatText: "",
    };
  }

  userTyping = (e) =>
    e.keyCode === 13
      ? this.submitMessage()
      : this.setState({ chatText: e.target.value });

  messageValid = (txt) => txt && txt.replace(/\s/g, "").length;

  submitMessage = () => {
    console.log(this.state.chatText);
    if (this.messageValid(this.state.chatText)) {
      this.props.submitMessageFn(this.state.chatText);
      document.getElementById("chattextbox").value = "";
      this.setState({ chatText: "" });
    }
  };

  userClickedInput = () => {
    this.props.messageReadFn();
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Box display="flex" p={1} className={classes.boxStyle}>
          <Box p={1} flexGrow={1} className={classes.boxStyle}>
            <Paper className={classes.paper}>
              <InputBase
                className={classes.input}
                placeholder="Type a message"
                onKeyUp={(e) => this.userTyping(e)}
                id="chattextbox"
                onFocus={this.userClickedInput}
                inputProps={{
                  "aria-label": "send a message",
                  autoComplete: "off",
                  autoCapitalize: "sentences",
                }}
              />
            </Paper>
          </Box>
          <Box p={1} className={classes.boxStyle}>
            <Fab
              variant="extended"
              color="secondary"
              size="small"
              style={{
                boxShadow: "none",
                width: "52px",
                height: "52px",
                borderRadius: "50%",
              }}
            >
              <SendIcon
                type="submit"
                onClick={this.submitMessage}
                className={classes.iconButton}
                aria-label="search"
                color="primary"
                fontSize="small"
              />
            </Fab>
          </Box>
        </Box>
      </div>
    );
  }
}

export default connect()(withStyles(styles)(ChatTextBoxComponent));
