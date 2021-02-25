import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import BusinessIcon from "@material-ui/icons/Business";
import InstagramIcon from "@material-ui/icons/Instagram";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { Component } from "react";

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
      <>
        <Paper className={classes.paperComponent} elevation={3}>
          <Grid container>
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
          </Grid>
        </Paper>
        <Grid container spacing={1} style={{ textAlign: "center" }}>
          <Grid item xs={4}>
            <Paper elevation={3} style={{ padding: 10 }}>
              <a
                target="_blank"
                href={`https://www.google.com/search?q=${camera}`}
              >
                <IconButton aria-label="icon">
                  <PhotoCameraIcon color="secondary" fontSize="large" />
                </IconButton>
              </a>
              <Typography
                variant="body1"
                gutterBottom
                className={classes.noOverflow}
              >
                {camera}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={4}>
            <Paper elevation={3} style={{ padding: 10 }}>
              <a target="_blank" href={`http://www.instagram.com/${instagram}`}>
                <IconButton aria-label="icon">
                  <InstagramIcon color="secondary" fontSize="large" />
                </IconButton>
              </a>
              <Typography
                variant="body1"
                gutterBottom
                className={classes.noOverflow}
              >
                {instagram}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={4}>
            <Paper elevation={3} style={{ padding: 10 }}>
              <IconButton aria-label="icon">
                <BusinessIcon color="secondary" fontSize="large" />
              </IconButton>

              <Typography
                variant="body1"
                gutterBottom
                className={classes.noOverflow}
              >
                {company}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </>
    );
  }
}

export default withStyles(styles)(usercard);
