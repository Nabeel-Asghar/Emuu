import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";

const styles = {
  img: {
    maxWidth: "150px",
    width: "100%",
    height: "auto",
    align: "right",
  },
};

class profileImage extends Component {
  render() {
    const { classes, profileImage } = this.props;
    return (
      <img className={classes.img} src={profileImage} alt="Profile Picture" />
    );
  }
}

export default withStyles(styles)(profileImage);
