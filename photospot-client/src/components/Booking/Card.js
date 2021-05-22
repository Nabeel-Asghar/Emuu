import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

// Card MUI
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import { formatMoney } from "../../util/UtilFunctions";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
  },
  image: {
    minWidth: 200,
    minHeight: 200,
  },

  content: {
    padding: 25,
    objectFit: "cover",
  },
};

class ProfileCard extends Component {
  render() {
    const {
      classes,
      photographerID,
      firstName,
      lastName,
      profileImage,
      date,
      type,
      time,
      price,
      location_city,
      location_state,
    } = this.props;

    return (
      <Card className={classes.card} style={{ marginBottom: 0 }}>
        <CardMedia
          className={classes.image}
          image={profileImage}
          title="Profile Image"
        />
        <CardContent className={classes.content} gutterBottom>
          <Typography variant="h5" gutterBottom>
            Book with&nbsp;{firstName}&nbsp;{lastName}
          </Typography>
          <div>
            {location_city && location_state && (
              <Typography variant="body1" gutterBottom>
                {location_city}, {location_state}
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
            {type && (
              <Typography variant="body1" gutterBottom>
                Type: {type}
              </Typography>
            )}
            {price && (
              <Typography variant="body1" gutterBottom>
                Price: <b>{formatMoney(price)}</b>
              </Typography>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(ProfileCard);
