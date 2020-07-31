import React, { Component } from "react";
import equal from "fast-deep-equal";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// Material UI
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import withStyles from "@material-ui/core/styles/withStyles";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Collapse from "@material-ui/core/Collapse";
import StarRatings from "react-star-ratings";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

// Redux
import { connect } from "react-redux";
import { getReviews } from "../../redux/actions/dataActions";

const styles = (theme) => ({
  ...theme.spreadThis,
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
});

class review extends Component {
  constructor() {
    super();
    this.state = {
      allReviews: [],
      openReview: false,
      title: "",
      rating: 0,
      description: "",
    };
  }

  componentDidMount() {
    this.props.getReviews(this.props.id).then(() => {
      this.setState({
        allReviews: this.props.reviews,
      });
      this.handleCount(this.state.allReviews);
    });
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.reviews, prevProps.reviews)) {
      this.setState({
        allReviews: this.props.reviews,
      });
      this.handleCount(this.state.allReviews);
    }
  }

  handleReviewDialog() {
    this.setState({
      openReview: !this.state.openReview,
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }

  handleCount(allReviews) {
    for (let i = 0; i < allReviews.length; i++) {
      let rating = allReviews[i].rating;

      this.props.handleRatingCount();
      this.props.handleRatingChange(rating);
    }
  }

  render() {
    dayjs.extend(relativeTime);
    const { classes, checked, overallRating, reviewCount } = this.props;
    return (
      <Collapse in={checked}>
        <div>
          {this.state.allReviews.map((review) => (
            <Card className={classes.root}>
              <CardContent>
                <Typography variant="h6">{review.title}</Typography>
                <Typography>
                  <StarRatings
                    rating={review.rating}
                    numberOfStars={5}
                    name="rating"
                    starDimension="15px"
                    starRatedColor="gold"
                    starSpacing="1px"
                  />
                </Typography>
                <Typography style={{ color: "gray" }} className={classes.pos}>
                  {review.firstName} {review.lastName} -{" "}
                  {dayjs(review.createdAt).fromNow()}
                </Typography>
                <Typography variant="body2" component="p">
                  {review.description}
                </Typography>
              </CardContent>
            </Card>
          ))}

          <Grid
            container
            alignItems="center"
            justify="flex-end"
            direction="row"
          >
            <Fab
              variant="extended"
              color="primary"
              aria-label="add"
              style={{ margin: "15px 0 20px 0" }}
              onClick={() => this.handleReviewDialog()}
            >
              <AddIcon className={classes.extendedIcon} />
              ADD REVIEW
            </Fab>
          </Grid>

          <Dialog
            fullWidth="true"
            maxWidth="sm"
            open={this.state.openReview}
            onClose={this.state.openReview}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Review Photographer"}
            </DialogTitle>
            <DialogContent>
              <Grid container>
                <Grid item xs={12}>
                  <DialogContentText id="title">
                    <TextField
                      id="standard-title"
                      name="title"
                      type="text"
                      label="Title"
                      value={this.state.title}
                      margin="normal"
                      variant="outlined"
                      onChange={this.handleChange}
                      required
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </DialogContentText>
                </Grid>

                <Grid item xs={12}>
                  <StarRatings
                    rating={this.state.rating}
                    starRatedColor="blue"
                    changeRating={this.changeRating}
                    numberOfStars={5}
                    name="rating"
                  />
                </Grid>

                <Grid item xs={12}>
                  <DialogContentText id="description">
                    <TextField
                      id="standard-description"
                      name="description"
                      type="text"
                      label="Description"
                      value={this.state.description}
                      margin="normal"
                      variant="outlined"
                      onChange={this.handleChange}
                      required
                      fullWidth
                      multiline
                      rows={4}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </DialogContentText>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => this.handleReviewDialog()}
                variant="contained"
                color="secondary"
              >
                Close
              </Button>
              <Button
                onClick={() => this.handleReviewDialog()}
                variant="contained"
                color="primary"
                autoFocus
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Collapse>
    );
  }
}

const mapStateToProps = (state) => ({
  reviews: state.data.reviews,
});

const mapActionsToProps = {
  getReviews,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(review));
