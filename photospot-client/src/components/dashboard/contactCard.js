import React, { Component } from "react";

// Material UI
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({
  ...theme.spreadThis,
  textLabels: {
    paddingBottom: "15px",
    fontWeight: "bold",
  },
});

class contactCard extends Component {
  render() {
    const { location_city, location_state, email, classes } = this.props;
    return (
      <Paper style={{ marginTop: "5px", padding: "20px 0px 15px 0px" }}>
        <div style={{ marginLeft: "45px" }}>
          <Typography variant="subtitle2">LOCATION</Typography>
          <Typography variant="body1" className={classes.textLabels}>
            {location_city}, {location_state}
          </Typography>
          <Typography variant="subtitle2">EMAIL</Typography>
          <Typography variant="body1" className={classes.textLabels}>
            {email}
          </Typography>
          <Typography variant="subtitle2">PHONE</Typography>
          <Typography variant="body1" className={classes.textLabels}>
            (248) 123-4555
          </Typography>
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(contactCard);
