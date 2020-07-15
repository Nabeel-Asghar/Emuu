import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Send from "@material-ui/icons/Send";

// Redux
import { connect } from "react-redux";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class ChatTextBoxComponent extends Component {
  constructor() {
    super();
    this.state = {
      chatText: "",
    };
  }

  render() {
    const { classes, submitMessageFn } = this.props;

    return (
      <div className={classes.chatTextBoxContainer}>
        <TextField
          placeholder="Enter a message..."
          onKeyUp={(e) => this.userTyping(e)}
          id="chattextbox"
          className={classes.chatTextBox}
          onFocus={this.userClickedInput}
        ></TextField>
        <Send onClick={this.submitMessage} className={classes.sendBtn}></Send>
      </div>
    );
  }

  userTyping = (e) =>
    e.keyCode === 13
      ? this.submitMessage()
      : this.setState({ chatText: e.target.value });

  messageValid = (txt) => txt && txt.replace(/\s/g, "").length;

  submitMessage = () => {
    if (this.messageValid(this.state.chatText)) {
      this.props.submitMessageFn(this.state.chatText);
      document.getElementById("chattextbox").value = "";
    }
  };

  userClickedInput = () => {
    console.log("Clicked input");
  };
}

export default connect()(withStyles(styles)(ChatTextBoxComponent));
