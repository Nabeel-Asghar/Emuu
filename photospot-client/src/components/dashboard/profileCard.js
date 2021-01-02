import React, { Component } from "react";
import { Link } from "react-router-dom";

// Material UI
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({
  ...theme.spreadThis,
  profileAvatar: {
    width: "225px",
    height: "225px",
    borderRadius: "50%",
    objectFit: "cover",
    padding: "10px",
  },
});

class profileCard extends Component {
  render() {
    const {
      profileImage,
      firstName,
      lastName,
      formattedDate,
      classes,
    } = this.props;
    return (
      <Paper style={{ paddingBottom: "20px" }}>
        <div style={{ textAlign: "center" }}>
          <img className={classes.profileAvatar} src={profileImage} />
          <Typography variant="h5">
            {firstName} {lastName}
          </Typography>
          <Typography
            variant="subtitle2"
            style={{ padding: "8px 0px 12px 0px" }}
          >
            Joined {formattedDate}
          </Typography>
          <Button
            component={Link}
            to="/profile"
            color="secondary"
            variant="contained"
          >
            Edit Profile
          </Button>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(profileCard);
