import React, { Component } from "react";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Typography } from "@material-ui/core";

// Redux
import { connect } from "react-redux";
import { deleteImages, uploadImages } from "../redux/actions/userActions";

// Components
import ImageGrid from "../components/shared/imageGrid";
import GoBackButton from "../components/shared/goBackButton";

const styles = (theme) => ({
  ...theme.spreadThis,
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    marginTop: "25px",
  },
});

class photographyPictures extends Component {
  constructor() {
    super();
    this.state = {
      images: [],
      imagesToUpload: [],
      imagesToDelete: [],
    };
  }

  componentDidMount() {
    this.setState({
      images: this.props.location.state.images,
    });
  }

  deleteImage(id) {
    var array = this.state.images;
    this.setState({
      imagesToDelete: [...this.state.imagesToDelete, array[id]],
    });

    array.splice(id, 1);
    this.setState({
      images: array,
    });
  }

  handleImageAdd = (event) => {
    const image = event.target.files[0];
    if (image) {
      this.setState({
        imagesToUpload: [...this.state.imagesToUpload, image],
      });
      this.setState({
        images: [...this.state.images, URL.createObjectURL(image)],
      });
    }
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById("addImage");
    fileInput.click();
  };

  handleSubmit() {
    this.props.deleteImages(this.state.imagesToDelete);

    const formData = new FormData();
    this.state.imagesToUpload.forEach((image) => {
      formData.append("image", image, image.name);
    });

    this.props.uploadImages(formData);
  }

  render() {
    const {
      classes,
      UI: { loading },
    } = this.props;

    return (
      <Paper style={{ margin: "15px 0" }}>
        <ImageGrid
          images={this.state.images}
          deleteImage={this.deleteImage.bind(this)}
          access={"photographer"}
        />
        <Grid container spacing={2}>
          {this.state.images.length < 6 && (
            <Grid
              item
              xs={12}
              className={classes.centerGrid}
              style={{ paddingTop: 20 }}
            >
              <Typography className={classes.customError} variant="subtitle">
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
                />
                Upload
              </Button>

              <Button
                variant="contained"
                color="secondary"
                disabled={
                  loading ||
                  this.state.images.length < 6 ||
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
        </Grid>
      </Paper>
    );
  }
}

const mapStateToProps = (state) => ({
  UI: state.UI,
});

const mapActionsToProps = {
  uploadImages,
  deleteImages,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(photographyPictures));
