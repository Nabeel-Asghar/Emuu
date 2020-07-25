import React, { Component } from "react";

import { Typography } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";

class bio extends Component {
  render() {
    const { bio, loading } = this.props;

    return (
      <Typography variant="h6">
        {loading ? <Skeleton width={500} /> : <div>{bio}</div>}
      </Typography>
    );
  }
}

export default bio;
