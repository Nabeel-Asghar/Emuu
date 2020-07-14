import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class usercard extends Component {
  render() {
    const {
      classes,
      firstName,
      lastName,
      profileImage,
      background,
    } = this.props;
    return (
      <div className={classes.container}>
        <img className={classes.profilePic} src={background} />

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