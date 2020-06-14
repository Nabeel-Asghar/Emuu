import React, { Component } from "react";
import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

// Card MUI
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import photographer from "../photographer";

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

class card extends Component {
  render() {
    const {
      classes,
      photographerID,
      firstName,
      lastName,
      profileImage,
    } = this.props;

    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.image}
          image={profileImage}
          title="Profile Image"
        />
        <CardContent className={classes.content}>
          <Typography variant="h5">
            Book with&nbsp;{firstName}&nbsp;{lastName}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(card);
