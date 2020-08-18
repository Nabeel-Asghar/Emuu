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
  card: {
    maxWidth: "100%",
    marginBottom: 20,
    height: "325px",
  },

  content: {
    padding: "15px 10px 15px 10px",
    objectFit: "cover",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },

  allText: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },

  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
};

class photographer extends Component {
  render() {
    const {
      classes,
      photographer: {
        photographerID,
        firstName,
        lastName,
        profileImage,
        location_city,
        location_state,
        camera,
        instagram,
        company,
        headline,
        reviewCount,
        totalRating,
      },
    } = this.props;

    return (
      <Grid item sm={6} md={4} xs={12}>
        <Card className={classes.card}>
          <Link
            to={`/photographers/${photographerID}`}
            style={{ textDecoration: "none" }}
          >
            <CardMedia
              className={classes.media}
              image={profileImage}
              title="Profile Image"
            />
          </Link>
          <CardContent className={classes.content}>
            <Typography variant="subtitle2" style={{ height: "25px" }}>
              {reviewCount ? (
                <Rating reviewCount={reviewCount} totalRating={totalRating} />
              ) : (
                "No reviews yet"
              )}
            </Typography>
            <Typography variant="h6" display="inline">
              {firstName}&nbsp;{lastName}
            </Typography>
            <Typography
              variant="subtitle1"
              color="textSecondary"
              display="inline"
            >
              &nbsp;-&nbsp;{location_city},&nbsp;{location_state}
            </Typography>
            <Typography variant="body1" className={classes.allText}>
              {headline}
            </Typography>
            <a
              target="_blank"
              href={`https://www.google.com/search?q=${camera}`}
            >
              <IconButton
                edge="end"
                aria-label="icon"
                style={{ padding: "10px", marginLeft: "-13px" }}
              >
                <PhotoCameraIcon color="secondary" />
              </IconButton>
            </a>
            &nbsp;&nbsp;{camera}
          </CardContent>
        </Card>
      </Grid>
    );
  }
}

export default withStyles(styles)(photographer);
