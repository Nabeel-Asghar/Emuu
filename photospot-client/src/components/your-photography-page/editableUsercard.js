import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Skeleton from "@material-ui/lab/Skeleton";
import InstagramIcon from "@material-ui/icons/Instagram";
import BusinessIcon from "@material-ui/icons/Business";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

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
      location_city,
      location_state,
      instagram,
      company,
      loading,
      headline,
    } = this.props;
    return (
      <Grid container>
        <Grid item xs={12}>
          {loading ? (
            <Skeleton
              variant="rect"
              className={classes.background}
              width={1000}
              height={200}
            />
          ) : (
            <div>
              <img
                className={classes.background}
                src={background}
                onClick={this.props.handleEditBackground}
              />

              <input
                type="file"
                id="imageInput"
                hidden="hidden"
                accept="image/*"
                onChange={this.props.handleBackgroundChange}
              />
            </div>
          )}
        </Grid>

        <Grid item xs={6}>
          {loading ? (
            <Skeleton variant="rect" className={classes.avatar} />
          ) : (
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
          )}
        </Grid>

        <Grid item xs={6} className={classes.rightGrid}>
          {loading ? (
            <Skeleton>
              <Typography variant="h3">Book</Typography>
            </Skeleton>
          ) : (
            <div>
              <Button
                className={classes.bookButton}
                disabled="true"
                variant="contained"
                color="primary"
                onClick={() =>
                  this.props.history.push(
                    `${this.props.history.location.pathname}/book`
                  )
                }
              >
                Book
              </Button>
              <Button
                className={classes.bookButton}
                variant="contained"
                color="secondary"
                disabled="true"
              >
                Contact
              </Button>
            </div>
          )}
        </Grid>

        <Grid item xs={8}>
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

        <Grid item xs={4}>
          <div style={{ width: "100%" }}>
            <List dense="true">
              <ListItem>
                <ListItemText
                  primary="Canon EOS Rebel T7"
                  style={{ textAlign: "right" }}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="icon">
                    <PhotoCameraIcon color="primary" />
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
                    <InstagramIcon color="primary" />
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
                    <BusinessIcon color="primary" />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(editableUsercard);
