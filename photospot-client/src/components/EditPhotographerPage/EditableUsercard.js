import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Skeleton from "@material-ui/lab/Skeleton";
import InstagramIcon from "@material-ui/icons/Instagram";
import BusinessIcon from "@material-ui/icons/Business";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import defaultProfilePicture from "../../images/defaultProfilePicture.png";
import defaultBackground from "../../images/defaultBackground.jpg";
import EditButton from "../Shared/Buttons/EditButton";

const styles = (theme) => ({
  ...theme.spreadThis,
  overlayBackground: {
    position: "absolute",
    top: 65,
    background: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    transition: ".5s ease",
    color: "#fff",
    fontSize: 20,
    padding: "20px 0",
    textAlign: "center",
    opacity: 1,
  },

  overlayBackgroundActive: {
    position: "absolute",
    top: 65,
    background: "rgba(35, 186, 139)",
    width: "100%",
    transition: ".5s ease",
    color: "#fff",
    fontSize: 20,
    padding: "20px 0",
    textAlign: "center",
    opacity: 1,
  },

  overlayProfile: {
    position: "absolute",
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    transition: ".5s ease",
    color: "#fff",
    fontSize: 20,
    padding: "20px 0",
    textAlign: "center",
    opacity: 1,
  },

  overlayProfileActive: {
    position: "absolute",
    bottom: 0,
    background: "rgba(35, 186, 139)",
    width: "100%",
    transition: ".5s ease",
    color: "#fff",
    fontSize: 20,
    padding: "20px 0",
    textAlign: "center",
    opacity: 1,
  },
});

class editableUsercard extends Component {
  constructor() {
    super();
    this.state = {
      hover: false,
      hoverProfile: false,
    };
  }

  render() {
    const {
      classes,
      firstName,
      lastName,
      profileImage,
      background,
      location_city,
      location_state,
      instagram,
      company,
      loading,
      headline,
      camera,
    } = this.props;
    return (
      <>
        <Grid container>
          <Grid item xs={12}>
            <div
              onMouseEnter={() => this.setState({ hover: true })}
              onMouseLeave={() => this.setState({ hover: false })}
              style={{ cursor: "pointer" }}
              onClick={this.props.handleEditBackground}
            >
              <img
                className={classes.background}
                src={background ? background : defaultBackground}
              />
              <input
                type="file"
                id="imageInput"
                hidden="hidden"
                accept="image/*"
                onInput={this.props.handleBackgroundChange}
              />
              <div
                className={
                  this.state.hover
                    ? classes.overlayBackgroundActive
                    : classes.overlayBackground
                }
              >
                EDIT IMAGE
              </div>
            </div>
          </Grid>

          <Grid item xs={12} className={classes.userCard}>
            <div style={{ textAlign: "center", marginTop: "-250px" }}>
              <div
                className={classes.avatarContainer}
                onClick={this.props.handleEditProfileImage}
                onMouseEnter={() => this.setState({ hoverProfile: true })}
                onMouseLeave={() => this.setState({ hoverProfile: false })}
                style={{ cursor: "pointer" }}
              >
                <img
                  className={classes.avatar}
                  src={profileImage ? profileImage : defaultProfilePicture}
                />
                <div
                  className={
                    this.state.hoverProfile
                      ? classes.overlayProfileActive
                      : classes.overlayProfile
                  }
                >
                  EDIT IMAGE
                </div>
              </div>
              <input
                type="file"
                id="profileImageInput"
                hidden="hidden"
                accept="image/*"
                onInput={this.props.handleProfileImageChange}
              />
            </div>
          </Grid>
        </Grid>
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              style={{ marginTop: 15 }}
              color="secondary"
              fullWidth
              onClick={() =>
                this.props.history.push(
                  `${this.props.history.location.pathname}/setYourSchedule`
                )
              }
            >
              Set Your Timings
            </Button>
          </Grid>

          <Paper elevation={3} className={classes.margin}>
            <Grid container>
              <EditButton
                onClick={this.props.handleOpenEdit}
                text="Edit User Info"
              />

              <Grid item sm={8} xs={12}>
                <div className={classes.textGrid}>
                  <Typography variant="h4">
                    {loading ? (
                      <Skeleton width="25%" />
                    ) : (
                      <div>
                        {firstName} {lastName}
                      </div>
                    )}
                  </Typography>

                  <Typography variant="h6">
                    {loading ? <Skeleton width="25%" /> : <div>{headline}</div>}
                  </Typography>

                  <Typography variant="subtitle1">
                    {loading ? (
                      <Skeleton width="25%" />
                    ) : (
                      <div>
                        {location_city}, {location_state}
                      </div>
                    )}
                  </Typography>
                </div>
              </Grid>

              <Grid item sm={4} xs={12}>
                <div style={{ width: "100%" }}>
                  <List dense="true">
                    <ListItem>
                      <ListItemText
                        primary={camera}
                        style={{ textAlign: "right" }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="icon">
                          <PhotoCameraIcon color="secondary" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                      <ListItemText
                        primary={instagram}
                        style={{ textAlign: "right" }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="icon">
                          <InstagramIcon color="secondary" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>

                    <ListItem>
                      <ListItemText
                        primary={company}
                        style={{ textAlign: "right" }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="icon">
                          <BusinessIcon color="secondary" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </div>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(editableUsercard);
