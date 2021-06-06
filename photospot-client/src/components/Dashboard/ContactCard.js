import React, { Component } from "react";

// Material UI
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class contactCard extends Component {
  render() {
    const { location_city, location_state, email, classes } = this.props;
    return (
      <Paper className={classes.cardStyle}>
        <div className={classes.interiorCard}>
          <Typography variant="subtitle2">LOCATION</Typography>
          <Typography variant="body1" className={classes.textStyle}>
            {location_city}, {location_city}
          </Typography>
          <Typography variant="subtitle2">EMAIL</Typography>
          <Typography variant="body1" className={classes.textStyle}>
            {email}
          </Typography>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(contactCard);
