import Backdrop from "@material-ui/core/Backdrop";
//Material UI
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import CloseIcon from "@material-ui/icons/Close";
import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import StarRatings from "react-star-ratings";
import "../your-photography-page/editBiocss.css";

const styles = (theme) => ({
  ...theme.spreadThis,
  root: {
    paddingBottom: "0px",
  },
  box: {
    display: "flex",
    alignItems: "center",
    marginBottom: "8px",
  },
  profileAvatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginRight: "10px",
  },
  btns: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  deleteBtn: {
    color: theme.palette.getContrastText(theme.palette.error.main),
    background: theme.palette.error.main,
    flex: 1,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
});

class ReviewDialog extends Component {
  constructor() {
    super();

    this.state = {
      title: "",
      description: "",
      oldRating: 0,
      photographerID: "",
    };
  }

  componentDidMount() {
    this.setState({
      title: this.props?.review?.title,
      description: this.props?.review?.description,
      oldRating: this.props?.review?.rating,
      photographerID: this.props?.review?.photographerID,
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.review !== prevProps.review) {
      this.setState({
        title: this.props?.review?.title,
        description: this.props?.review?.description,
        oldRating: this.props?.review?.rating,
        photographerID: this.props?.review?.photographerID,
      });
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const {
      classes,
      rating,
      newReviewSucess,
      loadingReviewAction,
      errors,
      photographerProfile,
      photographerLastName,
      photographerFirstName,
      deleteBtn,
      openBackdrop,
      typeReview,
    } = this.props;

    let deleteButton;
    if (deleteBtn) {
      deleteButton = (
        <Button
          className={classes.deleteBtn}
          onClick={this.props.handleDelete.bind(
            this,
            this.state.photographerID,
            this.state.oldRating
          )}
          variant="contained"
          color="error"
          autoFocus
        >
          <Typography style={{ fontWeight: "bold" }}>Delete</Typography>
        </Button>
      );
    }

    return (
      <Dialog
        fullWidth="true"
        maxWidth="sm"
        open={this.props.openReview}
        onClose={this.props.handleDisagree}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className={classes.root}>
          {this.props.type}
          <IconButton
            edge="end"
            onClick={this.props.handleDisagree}
            style={{ paddingTop: 0, float: "right" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <div className={classes.box}>
            <img className={classes.profileAvatar} src={photographerProfile} />
            <Typography variant="h5">
              {photographerFirstName} {photographerLastName}
            </Typography>
          </div>

          <Grid container>
            <Grid item xs={12}>
              <DialogContentText id="title">
                <TextField
                  id="standard-title"
                  color="secondary"
                  name="title"
                  type="text"
                  label="Title"
                  value={this.state.title}
                  margin="normal"
                  variant="outlined"
                  onChange={this.handleChange}
                  helperText={errors.title}
                  error={errors.title ? true : false}
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
                rating={rating}
                starRatedColor="blue"
                changeRating={this.props.changeRating}
                numberOfStars={5}
                name="newReviewRating"
                starDimension="20px"
                starRatedColor="#23ba8b"
                starHoverColor="#23ba8b"
              />
            </Grid>

            <Grid item xs={12}>
              <DialogContentText id="description">
                <TextField
                  id="standard-description"
                  name="description"
                  color="secondary"
                  type="text"
                  label="Description"
                  value={this.state.description}
                  helperText={errors.description}
                  error={errors.description ? true : false}
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

        {errors.error ? (
          <Typography style={{ color: "red", textAlign: "center" }}>
            {errors.error}
          </Typography>
        ) : (
          <Typography
            style={{ color: "green", textAlign: "center" }}
          ></Typography>
        )}

        <DialogActions>
          {newReviewSucess ? (
            <Backdrop
              className={classes.backdrop}
              open={openBackdrop}
              onClick={this.props.handleBackdropClose}
            >
              <CheckCircleOutlineIcon />
              <Typography variant="h6">
                Your review has been {typeReview}!
              </Typography>
            </Backdrop>
          ) : (
            <Grid container spacing={0}>
              <Grid item xs={3} className={classes.btns}>
                {deleteButton}
              </Grid>
              <Grid item xs={9} align="right" className={classes.btns}>
                <Button
                  onClick={this.props.handleDisagree}
                  variant="outlined"
                  color="secondary"
                  disabled={loadingReviewAction}
                >
                  <Typography style={{ fontWeight: "bold" }}>Close</Typography>
                </Button>

                <Button
                  onClick={this.props.handleReviewDialogAgree.bind(
                    this,
                    this.state.title,
                    this.state.description,
                    this.state.photographerID,
                    this.state.oldRating
                  )}
                  variant="contained"
                  color="secondary"
                  autoFocus
                  disabled={loadingReviewAction}
                >
                  <Typography style={{ fontWeight: "bold" }}>Review</Typography>
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ReviewDialog);
