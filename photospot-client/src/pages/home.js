import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import ChatListComponent from "../components/chatList";
import ChatViewComponent from "../components/chatView";

// Redux
import { connect } from "react-redux";
import { getPhotographers } from "../redux/actions/dataActions";
import { getChatList } from "../redux/actions/dataActions";

// Photographer
import Photographer from "../components/photographer";

import equal from "fast-deep-equal";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class home extends Component {
  constructor() {
    super();
    this.state = {
      selectedChat: null,
      newChatFormVisible: false,
      credentials: [],
      email: "",
      firstName: "",
      lastName: "",
      bio: "",
      profileImage: "",
      images: [],
      ratePerHour: 0,
      chats: [],
    };
  }

  assignStates = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  assignValues(details) {
    const photoDetails = Object.values(details);

    photoDetails.forEach((task) =>
      Object.entries(task).forEach(([key, value]) => {
        this.assignStates(key, value);
      })
    );
  }

  componentDidMount() {
    this.props.getPhotographers();
    this.props.getChatList();
    const credentials = this.props.credentials;
    this.setState({
      chats: Object.values(this.props.allMessages),
    });
    this.assignValues(this.props.credentials);
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.allMessages, prevProps.allMessages)) {
      this.setState({
        chats: Object.values(this.props.allMessages),
        credentials: Object.values(this.props.credentials),
      });
    }

    if (!equal(this.props.credentials, prevProps.credentials)) {
      this.assignValues(this.props.credentials);
    }
  }

  render() {
    const allThePhotographers = this.props.allPhotographers || {};

    let recentPhotographers = Object.keys(allThePhotographers).map((key) => (
      <Photographer key={key} photographer={allThePhotographers[key]} />
    ));

    return (
      <div>
        {/* <ChatListComponent
          history={this.props.history}
          newChatBtnFunction={this.newChatBtnClicked}
          selectChatFn={this.selectChat}
          chat={this.state.chats}
          userEmail={this.state.email}
          selectedChatIndex={this.state.selectedChat}
        ></ChatListComponent>

        {this.state.newChatFormVisible ? null : (
          <ChatViewComponent
            userEmail={this.state.email}
            chat={this.state.chats[this.state.selectedChat]}
          ></ChatViewComponent>
        )} */}

        <Grid container spacing={10}>
          <Grid item sm={3} xs={12}>
            <p>Search Box</p>
          </Grid>
          <Grid item sm={9} xs={12}>
            {recentPhotographers}
          </Grid>
        </Grid>
      </div>
    );
  }

  selectChat = (chatIndex) => {
    console.log("index", chatIndex);
    this.setState({ selectedChat: chatIndex });
  };

  newChatBtnClicked = () =>
    this.setState({ newChatFormVisible: true, selectChat: null });
}
const mapStateToProps = (state) => ({
  allPhotographers: state.data.allPhotographers,
  credentials: state.user.credentials,
  allMessages: state.data.allMessages,
});

const mapActionsToProps = {
  getPhotographers,
  getChatList,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(home));
