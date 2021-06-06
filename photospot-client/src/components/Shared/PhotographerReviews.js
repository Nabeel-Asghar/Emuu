// Material UI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import { withTheme } from "@material-ui/core/styles";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import StarRatings from "react-star-ratings";
import React, { Component } from "react";

const styles = (theme) => ({
  root: {
    marginTop: "8px",
    marginBottom: "8px",
  },
  pos: {
    marginBottom: 12,
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
});

class photographerReviews extends Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      review: { title, rating, description, firstName, lastName, createdAt },
    } = this.props;
    return (
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
          <Typography>
            <StarRatings
              rating={rating}
              numberOfStars={5}
              name="rating"
              starDimension="15px"
              starRatedColor={this.props.theme.palette.secondary.main}
              starSpacing="1px"
            />
          </Typography>
          <Typography style={{ color: "gray" }} className={classes.pos}>
            {firstName} {lastName} - {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body2" component="p">
            {description}
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(withTheme(photographerReviews));
