import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import withStyles from "@material-ui/core/styles/withStyles";
// Material UI
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import StarRatings from "react-star-ratings";

import React, { Component } from "react";

const styles = (theme) => ({
  ...theme.spreadThis,
  profileAvatar: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "10px",
  },
  root: {
    marginTop: "8px",
    marginBottom: "8px",
  },
  cardcontent: {
    padding: 0,
    "&:last-child": {
      paddingBottom: 0,
    },
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

class reviewList extends Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      review: {
        title,
        rating,
        description,
        photographerProfile,
        photographerLastName,
        photographerFirstName,
        createdAt,
      },
    } = this.props;

    return (
      <Card className={classes.root}>
        <CardContent style={{ padding: "8px" }}>
          <Grid container>
            <Grid item xs={11}>
              <Grid container spacing={2}>
                <Grid item>
                  <img
                    className={classes.profileAvatar}
                    src={photographerProfile}
                  />
                </Grid>
                <Grid item xs={12} sm container direction="column">
                  <Typography variant="h6">
                    {photographerFirstName} {photographerLastName}
                  </Typography>
                  <Typography variant="h7">{title}</Typography>
                  <Typography>
                    <StarRatings
                      rating={rating}
                      numberOfStars={5}
                      name="rating"
                      starDimension="15px"
                      starRatedColor="#23ba8b"
                      starSpacing="1px"
                    />
                  </Typography>
                  <Typography style={{ color: "gray" }} className={classes.pos}>
                    {dayjs(createdAt).fromNow()}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {description}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={1}>
              <List style={{ marginTop: "10px" }}>
                <ListItem>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="icon">
                      <EditIcon
                        color="secondary"
                        onClick={this.props.handleReviewOpenState.bind(
                          this,
                          this.props.index
                        )}
                      />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(reviewList);
