import React, { Component } from "react";
import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

// Card MUI
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";

const styles = {
  card: {
    width: "260px",
    marginBottom: 20,
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

class orderCard extends Component {
  render() {
    const {
      classes,
      photographer: {
        photographerID,
        firstName,
        lastName,
        profileImage,
        shootDate,
        shootTime,
      },
    } = this.props;

    return (
      <div>
        {photographerID && (
          <Card className={classes.card}>
            <CardMedia
              className={classes.media}
              image={profileImage}
              title="Profile Image"
              component={Link}
              to={`/photographers/${photographerID}`}
            />
            <CardContent className={classes.content}>
              <Typography variant="h5">
                {firstName}&nbsp;{lastName}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {moment(shootDate).format("LL")}
                {" at "}
                {moment(shootTime, "HH:mm").format("h:mm A")}
              </Typography>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(orderCard);
