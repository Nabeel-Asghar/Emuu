import React, { Component } from "react";
import { Link } from "react-router-dom";

// Components
import Rating from "./rating";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import IconButton from "@material-ui/core/IconButton";

const styles = {
  root: {
    padding: "5px 10px 0px 10px",
    paddingBottom: 0,
    objectFit: "cover",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    "&:last-child": {
      paddingBottom: 0,
    },
  },

  allText: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },

  media: {
    height: 0,
    paddingTop: "100%",
  },
};

class miniPhotographer extends Component {
  render() {
    const {
      classes,
      firstName,
      lastName,
      profileImage,
      location_city,
      location_state,
      date,
      time,
      price,
    } = this.props;

    return (
      <Grid item xs={10} style={{ margin: "0 auto" }}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={profileImage}
            title="Profile Image"
          />

          <CardContent className={classes.root}>
            <Typography variant="h6">
              {firstName}&nbsp;{lastName}
            </Typography>
            {location_city && location_state && (
              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
              >
                {location_city},&nbsp;{location_state}
              </Typography>
            )}
            {date && (
              <Typography variant="body1" gutterBottom>
                Date: {date}
              </Typography>
            )}
            {time && (
              <Typography variant="body1" gutterBottom>
                Time: {time}
              </Typography>
            )}
            {!!price && (
              <Typography variant="body1" gutterBottom>
                Price: <b>${price}.00</b>
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default withStyles(styles)(miniPhotographer);
