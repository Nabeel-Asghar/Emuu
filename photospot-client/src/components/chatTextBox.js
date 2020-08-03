import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import FilledInput from "@material-ui/core/FilledInput";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Paper from "@material-ui/core/Paper";
import Send from "@material-ui/icons/Send";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import DirectionsIcon from "@material-ui/icons/Directions";
import SendIcon from "@material-ui/icons/Send";
// Redux
import { connect } from "react-redux";

const styles = (theme) => ({
  ...theme.spreadThis,

  root: {
    marginTop: "10px",
    backgroundColor: "#e6e6e6",
    padding: "10px",
    display: "flex",
    alignItems: "center",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
    color: "secondary",
  },
  divider: {
    height: 28,
    margin: 4,
  },
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
      <div>
        <Paper
          component="form"
          className={classes.root}
          fullWidth
          square={false}
        >
          <InputBase
            className={classes.input}
            placeholder="Type a message"
            onKeyUp={(e) => this.userTyping(e)}
            id="chattextbox"
            onFocus={this.userClickedInput}
            inputProps={{ "aria-label": "send a message" }}
          />
          <Divider className={classes.divider} orientation="vertical" />

          <SendIcon
            type="submit"
            onClick={this.submitMessage}
            className={classes.iconButton}
            aria-label="search"
          />
        </Paper>

        {/*       <IconButton
            type="submit"
            onClick={this.submitMessage}
            className={classes.iconButton}
            aria-label="search"
          >
            <SendIcon />
          </IconButton> */}
      </div>
    );
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
    }
  };

  userClickedInput = () => {
    this.props.messageReadFn();
  };
}

export default connect()(withStyles(styles)(ChatTextBoxComponent));
