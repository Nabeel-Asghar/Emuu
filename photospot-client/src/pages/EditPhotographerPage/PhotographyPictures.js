import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import { nanoid } from "nanoid";
import React, { Component } from "react";
// Redux
import { connect } from "react-redux";
import GoBackButton from "../../components/Shared/Buttons/GoBackButton";
import FailureFeedback from "../../components/Shared/FailureFeedback";
// Components
import ImageGrid from "../../components/Shared/ImageGrid";
import LoadingPage from "../../components/Shared/LoadingPage";
import Progress from "../../components/Shared/Progress";
import Success from "../../components/Shared/Success";
import {
  deleteImages,
  getYourPhotographyPage,
  uploadImages,
} from "../../redux/actions/userActions";
import { firebase } from "../../util/Firestore";

const styles = (theme) => ({
  ...theme.spreadThis,
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    marginTop: "25px",
  },
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

class photographyPictures extends Component {
  constructor() {
    super();
    this.state = {
      intialImagesLength: 0,
      images: [],
      imagesToUpload: [],
      imagesToDelete: [],
      openProgress: false,
      uploadProgress: 0,
      uploadResponse: null,
      deleteResponse: null,
      success: false,
      failure: false,
      intialLoading: true,
    };
  }

  componentDidMount() {
    this.props.getYourPhotographyPage().then(() => {
      this.setState({
        images: this.props.yourPhotographerPage[0].images,
        intialImagesLength: this.props.yourPhotographerPage[0]?.images?.length,
        intialLoading: false,
      });
    });
  }

  deleteImage(id) {
    var currentImages = this.state.images;
    var uploadImages = this.state.imagesToUpload;

    if (currentImages[id].includes("blob")) {
      uploadImages.splice(-1 * (this.state.intialImagesLength - id), 1);
    } else {
      this.setState({
        imagesToDelete: [...this.state.imagesToDelete, currentImages[id]],
      });
    }

    currentImages.splice(id, 1);

    this.setState({
      images: currentImages,
      imagesToUpload: uploadImages,
    });
  }

  handleImageAdd = (event) => {
    const images = event.target.files;
    let imageUrls = this.state.images ? this.state.images : [];
    let newImages = this.state.imagesToUpload ? this.state.imagesToUpload : [];

    if (images) {
      for (let i = 0; i < images.length; i++) {
        imageUrls.push(URL.createObjectURL(images[i]));
        newImages.push(images[i]);
      }

      this.setState({
        images: imageUrls,
        imagesToUpload: newImages,
      });
    }
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById("addImage");
    fileInput.click();
  };

  decideFeedback = () => {
    const uploadResponse = this.state.uploadResponse;
    const deleteResponse = this.state.deleteResponse;

    console.log(uploadResponse, deleteResponse);

    if (uploadResponse === true && deleteResponse === true) {
      this.setState({ success: true });
    } else if (uploadResponse === false || deleteResponse === false) {
      this.setState({ failure: true });
    }
  };

  async handleSubmit() {
    this.setState({
      openProgress: true,
    });

    if (this.state.imagesToDelete.length > 0) {
      this.props
        .deleteImages(this.state.imagesToDelete)
        .then(() => {
          this.setState({ deleteResponse: true });
        })
        .catch(() => {
          this.setState({ deleteResponse: false });
        });

      if (this.state.imagesToUpload.length === 0) {
        await delay(1000);
        this.setState({ uploadResponse: true, uploadProgress: 100 });
      }
    }

    if (this.state.imagesToUpload.length > 0) {
      const promises = [];
      const imageNames = [];

      const that = this;

      const metadata = {
        contentType: "image/jpeg",
      };

      this.state.imagesToUpload.forEach((image) => {
        const imageName = nanoid(10);
        imageNames.push(imageName);

        var task = firebase
          .storage()
          .ref()
          .child(`users/${this.props.userID}/${imageName}`)
          .put(image, metadata);

        promises.push(task);

        task.on(
          "state_changed",
          function progress(snapshot) {
            var percentage =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            that.setState({
              uploadProgress: percentage,
            });
          },
          function error(err) {
            this.props.upload(false);
          }
        );
      });
      try {
        await Promise.all(promises)
          .then(() => {
            this.props.uploadImages(imageNames);
          })
          .catch((err) => this.props.upload(false));
      } catch (e) {
        this.setState({ uploadResponse: false });
      }

      this.setState({ uploadResponse: true });

      if (this.state.imagesToDelete.length === 0) {
        this.setState({
          deleteResponse: true,
        });
      }
    }

    this.decideFeedback();
  }

  render() {
    const {
      classes,
      UI: { loading },
    } = this.props;

    return (
      <>
        {this.state.intialLoading ? (
          <LoadingPage />
        ) : (
          <Paper style={{ margin: "15px 0", padding: 10 }}>
            <ImageGrid
              images={this.state.images}
              deleteImage={this.deleteImage.bind(this)}
              access={"photographer"}
            />
            <Grid container spacing={2}>
              {!this.state.images && (
                <Grid
                  item
                  xs={12}
                  className={classes.centerGrid}
                  style={{ paddingTop: 20, height: 100, marginTop: 100 }}
                >
                  <Typography variant="subtitle">
                    No images uploaded.
                  </Typography>
                </Grid>
              )}
              {this.state.images && this.state.images.length < 6 && (
                <Grid
                  item
                  xs={12}
                  className={classes.centerGrid}
                  style={{ paddingTop: 20 }}
                >
                  <Typography
                    className={classes.customError}
                    variant="subtitle"
                  >
                    *You must have at least 6 images*
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12} className={classes.centerGrid}>
                <div className={classes.root}>
                  <GoBackButton {...this.props} />
                  <Button
                    variant="outlined"
                    color="secondary"
                    disabled={loading}
                    startIcon={<CloudUploadIcon />}
                    onClick={this.handleEditPicture}
                  >
                    <input
                      type="file"
                      id="addImage"
                      accept="image/*"
                      onChange={this.handleImageAdd}
                      hidden
                      multiple
                    />
                    Upload
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={
                      loading ||
                      this.state?.images?.length < 6 ||
                      (this.state.imagesToUpload.length < 1 &&
                        this.state.imagesToDelete.length < 1)
                    }
                    startIcon={<SaveIcon />}
                    onClick={() => this.handleSubmit()}
                  >
                    Save Changes
                    {loading && (
                      <CircularProgress
                        className={classes.progress}
                        color="secondary"
                      />
                    )}
                  </Button>
                </div>
              </Grid>

              <Progress
                open={this.state.openProgress}
                value={Number.parseFloat(this.state.uploadProgress).toFixed(0)}
              />

              <Success
                open={this.state.success}
                headline="Success!"
                body="Your changes have been saved."
                reload={true}
              />

              <FailureFeedback
                open={this.state.failure}
                headline="Uh Oh!"
                body="Something went wrong. Please try again."
                reload={true}
              />
            </Grid>
          </Paper>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  UI: state.UI,
  userID: state.user?.credentials[0]?.userID,
  yourPhotographerPage: state.user.yourPhotographyPageDetails,
});

const mapActionsToProps = {
  uploadImages,
  deleteImages,
  getYourPhotographyPage,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(photographyPictures));