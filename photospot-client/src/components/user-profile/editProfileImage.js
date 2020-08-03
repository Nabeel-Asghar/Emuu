import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
  ...theme.spreadThis,
  profileAvatar: {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    objectFit: "cover",
    padding: "10px",
  },
});

class editProfileImage extends Component {
  render() {
    const { classes, profileImage } = this.props;

    return (
      <div>
        <Button onClick={this.props.handleEditProfileImage}>
          <img className={classes.profileAvatar} src={profileImage} />
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
