import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";

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
      loading = true,
    } = this.props;
    return (
      <div className={classes.container}>
        {loading ? (
          <Skeleton
            variant="rect"
            className={classes.profileImage}
            width={850}
            height={200}
          />
        ) : (
          <img className={classes.profilePic} src={background} />
        )}

        <div className={classes.centered}>
          {loading ? (
            <Skeleton variant="rect" className={classes.avatar} />
          ) : (
            <img className={classes.avatar} src={profileImage} />
          )}
        </div>

        <div className={classes.text}>
          <Typography variant="h4">
            {loading ? (
              <Skeleton width="100%" />
            ) : (
              <div>
                {firstName} {lastName}
              </div>
            )}
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(usercard);
