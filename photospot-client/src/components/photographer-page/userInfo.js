import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import BusinessIcon from "@material-ui/icons/Business";
import InstagramIcon from "@material-ui/icons/Instagram";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Skeleton from "@material-ui/lab/Skeleton";
import Paper from "@material-ui/core/Paper";
import React, { Component } from "react";
import firebase from "../../firestore";
import NewChatComponent from "../messaging/newChat";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class usercard extends Component {
  render() {
    const {
      classes,
      firstName,
      lastName,
      location_city,
      location_state,
      instagram,
      company,
      loading,
      headline,
      camera,
    } = this.props;

    return (
      <Paper
        style={{ width: "100%", marginTop: "10px", padding: "15px 0px" }}
        elevation={3}
      >
        <Grid container>
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

              <Typography variant="h6" gutterBottom>
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
                    <a
                      target="_blank"
                      href={`https://www.google.com/search?q=${camera}`}
                    >
                      <IconButton edge="end" aria-label="icon">
                        <PhotoCameraIcon color="secondary" />
                      </IconButton>
                    </a>
                  </ListItemSecondaryAction>
                </ListItem>

                <ListItem>
                  <ListItemText
                    primary={instagram}
                    style={{ textAlign: "right" }}
                  />
                  <ListItemSecondaryAction>
                    <a
                      target="_blank"
                      href={`http://www.instagram.com/${instagram}`}
                    >
                      <IconButton edge="end" aria-label="icon">
                        <InstagramIcon color="secondary" />
                      </IconButton>
                    </a>
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
    );
  }
}

export default withStyles(styles)(usercard);
