import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Redirect } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import {
  getVault,
  getDownload,
  uploadToVault,
  getSize,
  deleteImages,
} from "../redux/actions/vaultActions";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import GetAppIcon from "@material-ui/icons/GetApp";

// Components
import ImageGrid from "../components/shared/imageGrid";
import GoBackButton from "../components/shared/goBackButton";
import ProgressBar from "../components/photo-vault/progressBar";
import Success from "../components/shared/success";
import Progress from "../components/shared/progress";

const styles = (theme) => ({
  ...theme.spreadThis,
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    marginTop: "25px",
  },
});

class photoVault extends Component {
  constructor() {
    super();
    this.state = {
      access: "",
      vaultData: [],
      intialImagesLength: 0,
      images: [],
      imagesToUpload: [],
      imagesToDelete: [],
      imageSizes: [],
      totalSize: 0,
      open: false,
      disabled: true,
      openProgress: false,
      downloadDisable: false,
    };
  }

  async componentDidMount() {
    await this.props.getVault(this.props.match.params.orderID).then(() => {
      this.setState({
        access: this.props.vault.access,
        images: this.props.vault.vaultData.images,
      });
    });
    await this.props.getSize(this.props.match.params.orderID).then(() => {
      this.setState(
        {
          imageSizes: Object.values(this.props.vault.vaultSize),
        },
        this.setSize()
      );
    });
    if (this.state.access) {
      this.setState({
        intialImagesLength:
          this.props.vault.vaultData.images &&
          this.props.vault.vaultData.images.length,
      });
    }
  }

  setSize() {
    let totalSize = 0;
    let allTheSizes =
      this.state.imageSizes.length > 0
        ? this.state.imageSizes
        : Object.values(this.props.vault.vaultSize);

    Object.keys(allTheSizes).forEach(function (key) {
      totalSize += parseInt(allTheSizes[key]);
    });

    this.setState({
      totalSize: (totalSize / Math.pow(1024, 2)).toFixed(2),
    });
  }

  deleteImage(id) {
    var currentImages = this.state.images;
    var currentSizes = this.state.imageSizes;
    var uploadImages = this.state.imagesToUpload;

    if (currentImages[id].includes("blob")) {
      uploadImages.splice(-1 * (this.state.intialImagesLength - id), 1);
    } else {
      this.setState({
        imagesToDelete: [...this.state.imagesToDelete, currentImages[id]],
      });
    }

    currentImages.splice(id, 1);
    currentSizes.splice(id, 1);

    this.setState(
      {
        images: currentImages,
        imageSizes: currentSizes,
        imagesToUpload: uploadImages,
        disabled: false,
      },
      this.setSize()
    );
  }

  handleImageAdd = async (event) => {
    const images = event.target.files;
    let imageUrls = this.state.images ? this.state.images : [];
    let newImages = this.state.imagesToUpload ? this.state.imagesToUpload : [];
    let newImageSizes = this.state.imageSizes ? this.state.imageSizes : [];

    if (images) {
      for (let i = 0; i < images.length; i++) {
        imageUrls.push(URL.createObjectURL(images[i]));
        newImages.push(images[i]);
        newImageSizes.push(images[i].size);
        // console.log("GB: ", event.target.files[0].size / Math.pow(1024, 3));
      }

      this.setState(
        {
          images: imageUrls,
          imagesToUpload: newImages,
          imageSizes: newImageSizes,
          disabled: false,
        },
        this.setSize()
      );
    }
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById("addImage");
    fileInput.click();
  };

  downloadImages() {
    this.setState({ downloadDisable: true });
    this.props
      .getDownload(this.props.match.params.orderID)
      .then(() => this.setState({ downloadDisable: false }));
  }

  async handleSubmit() {
    this.setState({
      disabled: true,
      openProgress: true,
      downloadDisable: true,
    });
    const formData = new FormData();

    this.state.imagesToUpload.forEach((image) => {
      formData.append("image", image, image.name);
    });

    await this.props.deleteImages(
      this.props.match.params.orderID,
      this.state.imagesToDelete
    );
    await this.props.uploadToVault(this.props.match.params.orderID, formData);

    this.setState({ open: true });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.pageContainer}>
        {this.state.access ? (
          <Paper>
            <Grid container style={{ padding: "10px 10px" }}>
              <Grid item xs={2} style={{ textAlign: "left" }}>
                <GoBackButton
                  {...this.props}
                  disabled={this.state.openProgress}
                />
              </Grid>

              <Grid item xs={8} style={{ textAlign: "center" }}>
                <ProgressBar
                  totalSize={this.state.totalSize}
                  setSize={this.setSize.bind(this)}
                />
              </Grid>
              <Grid item xs={2} style={{ textAlign: "right" }}>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={() => this.downloadImages()}
                  disabled={this.state.downloadDisable}
                  startIcon={<GetAppIcon />}
                >
                  Download
                  {this.state.downloadDisable && (
                    <CircularProgress
                      color="secondary"
                      className={classes.progress}
                    />
                  )}
                </Button>
              </Grid>
              {this.state.images && (
                <ImageGrid
                  images={this.state.images}
                  deleteImage={this.deleteImage.bind(this)}
                  access={this.state.access}
                />
              )}
              <Grid item xs={12}>
                {this.state.access === "photographer" && (
                  <div className={classes.root}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<CloudUploadIcon />}
                      onClick={this.handleEditPicture}
                      disabled={this.state.openProgress}
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
                      disabled={this.state.disabled}
                      startIcon={<SaveIcon />}
                      onClick={() => this.handleSubmit()}
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
              </Grid>
            </Grid>

            <Progress
              open={this.state.openProgress}
              value={this.props.vault.progress}
            />

            <Success
              open={this.state.open}
              body={
                <div>
                  <Typography>{this.props.vault.vaultResponse[0]}</Typography>
                  <Typography>{this.props.vault.vaultResponse[1]}</Typography>
                </div>
              }
              reload={true}
            />
          </Paper>
        ) : (
          <Typography>You do not have access to this!</Typography>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  vault: state.vault,
});

const mapActionsToProps = {
  getVault,
  getDownload,
  uploadToVault,
  getSize,
  deleteImages,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(photoVault));
