import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import SendIcon from "@material-ui/icons/Send";
import Timeline from "@material-ui/lab/Timeline";
import SearchIcon from "@material-ui/icons/Search";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import TimelineDot from "@material-ui/lab/TimelineDot";

const styles = (theme) => ({
  ...theme.spreadThis,

  paper: {
    padding: "6px 16px",
    alignItems: "center",
    display: "flex",
  },

  boldText: {
    fontWeight: "bold",
  },

  mobileTimeline: {
    margin: "10px 0",
  },

  icon: {
    fontSize: 50,
    paddingRight: 15,
  },
});

const search = (
  <div>
    <Typography variant="h6" component="h1" style={{ fontWeight: "bold" }}>
      Search
    </Typography>
    <Typography variant="h6">
      Look for any photographer in your area thats fits your needs and book
    </Typography>
  </div>
);

const signup = (
  <div>
    <Typography variant="h6" component="h1" style={{ fontWeight: "bold" }}>
      Sign up
    </Typography>
    <Typography variant="h6">
      Make a completely free account on PhotoSpot
    </Typography>
  </div>
);

const shoot = (
  <div>
    <Typography variant="h6" component="h1" style={{ fontWeight: "bold" }}>
      Shoot
    </Typography>
    <Typography variant="h6">
      Have fun at your photoshoot! We handle all the annoying payments
    </Typography>
  </div>
);

const recieve = (
  <div>
    <Typography variant="h6" component="h1" style={{ fontWeight: "bold" }}>
      Recieve
    </Typography>
    <Typography variant="h6">
      Recieve those awesome pictures from the photographer
    </Typography>
  </div>
);

class timeline extends Component {
  render() {
    const { classes, fullScreen } = this.props;
    return (
      <Grid container justify="center" spacing={2}>
        <div
          style={{
            width: 1000,
            margin: "auto",
            padding: "60px 20px 60px 20px",
          }}
        >
          <Grid item xs={12}>
            <Typography
              variant="h4"
              style={{ padding: "20px 0 20px 0", textAlign: "center" }}
            >
              How does it work?
            </Typography>
          </Grid>
          {fullScreen ? (
            <>
              <Grid item xs={12} className={classes.mobileTimeline}>
                <Paper elevation={3} className={classes.paper}>
                  <AssignmentTurnedInIcon
                    color="secondary"
                    className={classes.icon}
                  />
                  {signup}
                </Paper>
              </Grid>
              <Grid item xs={12} className={classes.mobileTimeline}>
                <Paper elevation={3} className={classes.paper}>
                  <SearchIcon color="secondary" className={classes.icon} />
                  {search}
                </Paper>
              </Grid>
              <Grid item xs={12} className={classes.mobileTimeline}>
                <Paper elevation={3} className={classes.paper}>
                  <PhotoCameraIcon color="secondary" className={classes.icon} />
                  {shoot}
                </Paper>
              </Grid>
              <Grid item xs={12} className={classes.mobileTimeline}>
                <Paper elevation={3} className={classes.paper}>
                  <SendIcon color="secondary" className={classes.icon} />
                  {recieve}
                </Paper>
              </Grid>
            </>
          ) : (
            <Timeline align="alternate">
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot>
                    <AssignmentTurnedInIcon fontSize="large" />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} className={classes.paper}>
                    {signup}
                  </Paper>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="primary">
                    <SearchIcon fontSize="large" />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} className={classes.paper}>
                    {search}
                  </Paper>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="secondary" variant="outlined">
                    <PhotoCameraIcon fontSize="large" />
                  </TimelineDot>
                  <TimelineConnector className={classes.secondaryTail} />
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} className={classes.paper}>
                    {shoot}
                  </Paper>
                </TimelineContent>
              </TimelineItem>

              <TimelineItem>
                <TimelineSeparator>
                  <TimelineDot color="secondary">
                    <SendIcon fontSize="large" />
                  </TimelineDot>
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={3} className={classes.paper}>
                    {recieve}
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          )}
        </div>
      </Grid>
    );
  }
}

export default withStyles(styles)(timeline);
