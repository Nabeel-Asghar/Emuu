import React, { Component } from "react";
import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

// Card MUI
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
  },

  content: {
    padding: 25,
    objectFit: "cover",
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
      },
    } = this.props;

    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.image}
          image={profileImage}
          title="Profile Image"
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/photographers/${photographerID}`}
          >
            {firstName}&nbsp;{lastName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {location_city},&nbsp;{location_state}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(photographer);
