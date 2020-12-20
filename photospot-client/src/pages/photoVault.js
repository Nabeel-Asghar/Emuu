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
  notifyCustomer,
  confirmPictures,
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
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

// Components
import ImageGrid from "../components/shared/imageGrid";
import GoBackButton from "../components/shared/goBackButton";
import ProgressBar from "../components/photo-vault/progressBar";
import Success from "../components/shared/success";
import Progress from "../components/shared/progress";
import Confirmation from "../components/shared/confirmation";

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
      openDialog: false,
      notifiedCustomer: true,
      confirmedByCustomer: false,
      openSuccessNotification: false,
      openCustomerFinal: false,
      openSuccessFinalize: false,
    };
  }

  async componentDidMount() {
    await this.props.getVault(this.props.match.params.orderID).then(() => {
      this.setState({
        access: this.props.vault.access,
        images: this.props.vault.vaultData.images,
        notifiedCustomer: this.props.vault.vaultData.notifiedCustomer,
        confirmedByCustomer: this.props.vault.vaultData.confirmedByCustomer,
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

    if (this.state.imagesToDelete.length > 0) {
      await this.props.deleteImages(
        this.props.match.params.orderID,
        this.state.imagesToDelete
      );
    }
    if (this.state.imagesToUpload.length > 0) {
      await this.props.uploadToVault(this.props.match.params.orderID, formData);
    }

    this.setState({ open: true });
  }

  notifyCustomer() {
    this.setState({
      disabled: true,
      openDialog: false,
    });

    this.props.notifyCustomer(this.props.match.params.orderID).then(() => {
      this.setState({
        openSuccessNotification: true,
      });
    });
  }

  confirmPictures() {
    this.setState({
      disabled: true,
      openCustomerFinal: false,
    });

    this.props.confirmPictures(this.props.match.params.orderID).then(() => {
      this.setState({
        openSuccessFinalize: true,
      });
    });
  }

  openFinalizeDialog(type) {
    type === "photographer"
      ? this.setState({
          openDialog: true,
        })
      : this.setState({
          openCustomerFinal: true,
        });
  }

  closeFinalizeDialog(type) {
    type === "photographer"
      ? this.setState({
          openDialog: false,
        })
      : this.setState({
          openCustomerFinal: false,
        });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.pageContainer}>
        {this.state.access ? (
          <Paper>
            <Grid container style={{ padding: "10px 10px" }}>
              <Grid item xs={3} style={{ textAlign: "left" }}>
                <GoBackButton
                  {...this.props}
                  disabled={this.state.openProgress}
                />
              </Grid>

              <Grid item xs={6} style={{ textAlign: "center" }}>
                <ProgressBar
                  totalSize={this.state.totalSize}
                  setSize={this.setSize.bind(this)}
                />
              </Grid>
              <Grid item xs={3} style={{ textAlign: "right" }}>
                {this.state.access === "photographer" ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={
                      this.state.openProgress ||
                      this.state.notifiedCustomer ||
                      this.props.vault.loading
                    }
                    onClick={() => this.openFinalizeDialog("photographer")}
                    startIcon={<NotificationsActiveIcon />}
                  >
                    Notify Customer
                    {this.props.vault.loading && (
                      <CircularProgress
                        color="secondary"
                        className={classes.progress}
                      />
                    )}
                  </Button>
                ) : (
                  this.state.confirmedByCustomer && (
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
                  )
                )}
              </Grid>
              {this.state.images && (
                <ImageGrid
                  images={this.state.images}
                  deleteImage={this.deleteImage.bind(this)}
                  access={this.state.access}
                />
              )}
              <Grid item xs={12} className={classes.centerGrid}>
                <div className={classes.root}>
                  {this.state.access === "photographer" ? (
                    <>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<CloudUploadIcon />}
                        onClick={this.handleEditPicture}
                        disabled={
                          this.state.openProgress ||
                          this.state.confirmedByCustomer
                        }
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
                    </>
                  ) : (
                    this.state.notifiedCustomer &&
                    !this.state.confirmedByCustomer && (
                      <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => this.openFinalizeDialog()}
                      >
                        Confirm Pictures
                      </Button>
                    )
                  )}
                </div>
              </Grid>
            </Grid>

            {/* Notify customer that photos are finished */}
            <Confirmation
              open={this.state.openDialog}
              secondaryConfirmation={false}
              handleAgree={() => this.notifyCustomer()}
              handleDisagree={() => this.closeFinalizeDialog("photographer")}
              title="Confirm Notifying Customer"
              text={
                "This will notify the customer that the photos are finished. Do not confirm if you are still uploading or still need to upload."
              }
            />

            {/* Customer confirms pictures and photographer is paid */}
            <Confirmation
              open={this.state.openCustomerFinal}
              secondaryConfirmation={true}
              handleAgree={() => this.confirmPictures()}
              handleDisagree={() => this.closeFinalizeDialog()}
              title="Confirm Pictures"
              text={
                "This will pay your photographer and finalize your shoot. You will be allowed to download photos in this vault after confirming."
              }
              label="This is not reversable. Are you sure you want to do this?"
            />

            <Progress
              open={this.state.openProgress}
              value={this.props.vault.progress}
            />

            <Success
              open={this.state.openSuccessNotification}
              headline="Awesome!"
              body={
                <Typography>
                  Successfully notified and emailed customer.
                </Typography>
              }
              reload={true}
            />

            <Success
              open={this.state.openSuccessFinalize}
              headline="Awesome!"
              body={
                <Typography>{this.props.vault.finalizeResponse}</Typography>
              }
              reload={true}
            />

            <Success
              open={this.state.open}
              headline="Awesome!"
              body={
                <div>
                  {this.props.vault.uploadResponse && (
                    <Typography>{this.props.vault.uploadResponse}</Typography>
                  )}
                  {this.props.vault.deleteResponse && (
                    <Typography>{this.props.vault.deleteResponse}</Typography>
                  )}
                </div>
              }
              reload={true}
            />
          </Paper>
        ) : (
          <Typography
            variant="h4"
            style={{ textAlign: "center", fontWeight: "bold" }}
          >
            You do not have access to this!
          </Typography>
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
  notifyCustomer,
  confirmPictures,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(photoVault));
