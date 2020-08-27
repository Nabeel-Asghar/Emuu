import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";

const styles = (theme) => ({
  ...theme.spreadThis,
  profileAvatar: {
    width: "250px",
    height: "250px",
    borderRadius: "50%",
    objectFit: "cover",
  },
});

class editProfileImage extends Component {
  render() {
    const { classes, profileImage } = this.props;

    return (
      <div style={{ padding: "25px 0 25px 0" }}>
        <img className={classes.profileAvatar} src={profileImage} />
        <input
          type="file"
          id="profileImageInput"
          hidden="hidden"
          accept="image/*"
          onChange={this.props.handleProfileImageChange}
        />
        <Tooltip
          title="Edit Profile Image"
          placement="left-start"
          style={{ marginLeft: "-50px" }}
        >
          <IconButton onClick={this.props.handleEditProfileImage}>
            <EditIcon color="secondary" />
          </IconButton>
        </Tooltip>
      </div>
    );
  }
}

export default withStyles(styles)(editProfileImage);
