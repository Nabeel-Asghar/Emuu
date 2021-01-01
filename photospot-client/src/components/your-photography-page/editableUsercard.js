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
      camera,
    } = this.props;
    return (
      <>
        <Grid container>
          <Grid item xs={12}>
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
          </Grid>

          <Grid item xs={12}>
            <div style={{ textAlign: "center", marginTop: "-250px" }}>
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
              variant="outlined"
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
              <Grid item xs={12} className={classes.rightGrid}>
                <br />
                <IconButton style={{ marginTop: "5px", marginBottom: "-5px" }}>
                  <EditIcon
                    color="secondary"
                    onClick={() => this.props.handleOpenEdit()}
                  />
                </IconButton>
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
