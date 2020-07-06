import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class usercard extends Component {
  render() {
    const {
    return (
      <div className={classes.container}>
        <img
          className={classes.profilePic}
          src={
            "https://static.photocdn.pt/images/articles/2019/07/19/nature_photography_tips_for_beginners.jpg"
          }
        />

        <div className={classes.centered}>
          <img className={classes.avatar} src={profileImage} />
        </div>

        <div className={classes.text}>
          <Typography variant="h4">
            {firstName} {lastName}
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(usercard);
