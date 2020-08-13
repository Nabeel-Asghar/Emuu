import React, { Component } from "react";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";
import Grid from "@material-ui/core/Grid";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
  },

  content: {
    padding: "15px 10px 15px 10px",
    objectFit: "cover",
  },

  media: {
    height: 190,
  },
};

class photographer extends Component {
  render() {
    const { classes } = this.props;

    let array = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
      <Grid container spacing={2}>
        {array.map((home) => (
          <Grid item sm={6} md={4} xs={12}>
            <Skeleton
              animation="wave"
              variant="rect"
              className={classes.media}
            />

            <Skeleton width="100%">
              <Typography variant="h5">Hello Absolute Shite World</Typography>
            </Skeleton>
            <Skeleton width="100%">
              <Typography variant="h6">Hello Kinda Shite World</Typography>
            </Skeleton>
            <Skeleton width="100%">
              <Typography variant="h6">Hello Kinda Shi World</Typography>
            </Skeleton>
          </Grid>
        ))}
      </Grid>
    );
  }
}

export default withStyles(styles)(photographer);
