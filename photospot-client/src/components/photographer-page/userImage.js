import Skeleton from "@material-ui/lab/Skeleton";
import React, { Component } from "react";
import firebase from "../../firestore";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class userImage extends Component {
  render() {
    const { background, classes, loading } = this.props;

    return (
      <div>
        {loading ? (
          <Skeleton
            variant="rect"
            className={classes.background}
            width="100%"
            height={500}
          />
        ) : (
          <img className={classes.background} src={background} />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(userImage);
