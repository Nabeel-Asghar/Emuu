import React, { Component } from "react";

import { Typography } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

class bio extends Component {
  render() {
    const { bio, loading, classes } = this.props;

    return (
      <Typography variant="body1">
        {loading ? (
          <Skeleton width={750} height={100} />
        ) : (
          <div className={classes.textGrid}>
            <Typography variant="h6">A little bit about me...</Typography>
            {bio}
          </div>
        )}
      </Typography>
    );
  }
}

export default bio;