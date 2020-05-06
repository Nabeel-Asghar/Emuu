import React, { Component } from "react";
import Link from "react-router-dom/Link";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

// Card MUI
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";

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
        createdAt,
        profileImage,
      },
    } = this.props;
    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.image}
          image={profileImage}
          title="Profile Image"
        />
        <CardContent class={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/photographers/${photographerID}`}
          >
            {firstName}&nbsp;{lastName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {createdAt}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(photographer);
