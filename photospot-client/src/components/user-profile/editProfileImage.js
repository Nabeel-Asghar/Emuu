import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class editProfileImage extends Component {
  render() {
    const { classes, profileImage } = this.props;

    return (
      <div>
        <Button onClick={this.props.handleEditProfileImage}>
          <img className={classes.avatar} src={profileImage} />
        </Button>
        <input
          type="file"
          id="profileImageInput"
          hidden="hidden"
          accept="image/*"
          onChange={this.props.handleProfileImageChange}
        />
      </div>
    );
  }
}

export default withStyles(styles)(editProfileImage);
