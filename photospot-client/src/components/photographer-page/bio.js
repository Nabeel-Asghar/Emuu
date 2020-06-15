import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import { Typography } from "@material-ui/core";

const styles = {
  img: {
    maxWidth: "150px",
    width: "100%",
    height: "auto",
    align: "right",
  },
};

class bio extends Component {
  render() {
    const { bio } = this.props;
    return <Typography variant="body2">{bio}</Typography>;
  }
}

export default withStyles(styles)(bio);
