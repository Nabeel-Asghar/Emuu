import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class editableUsercard extends Component {
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
        <div>
          <Button onClick={this.props.handleEditBackground}>
            <img className={classes.profilePic} src={background} />
          </Button>

          <input
            type="file"
            id="imageInput"
            hidden="hidden"
            accept="image/*"
            onChange={this.props.handleBackgroundChange}
          />
        </div>
        <div className={classes.centered}>
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

        <div className={classes.text}>
          <Typography variant="h4">
            {firstName} {lastName}
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(editableUsercard);
