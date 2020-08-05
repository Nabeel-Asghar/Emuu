import React, { Component } from "react";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Skeleton from "@material-ui/lab/Skeleton";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
  },
  skeletonImage: {
    width: "200px",
    height: "115px",
  },

  content: {
    padding: 25,
    objectFit: "cover",
  },
};

class photographer extends Component {
  render() {
    const { classes } = this.props;

    let array = [1, 2, 3, 4, 5, 6, 7, 8];

    return (
      <div>
        {array.map((home) => (
          <Card className={classes.card}>
            <CardMedia>
              <Skeleton
                animation="wave"
                variant="rect"
                className={classes.skeletonImage}
              />
            </CardMedia>
            <CardContent className={classes.content}>
              <Skeleton width="100%">
                <Typography variant="h5">Hello Absolute Shite World</Typography>
              </Skeleton>
              <Skeleton width="100%">
                <Typography variant="h6">Hello Kinda Shi World</Typography>
              </Skeleton>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(photographer);
