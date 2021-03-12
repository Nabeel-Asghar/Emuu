import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Redirect } from "react-router-dom";
import { nanoid } from "nanoid";

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
import Typography from "@material-ui/core/Typography";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";

// Components
import ImageGrid from "../components/shared/imageGrid";
import ProgressBar from "../components/photo-vault/progressBar";
import Success from "../components/shared/success";
import Progress from "../components/shared/progress";
import Confirmation from "../components/shared/confirmation";
import LoadingPage from "../components/shared/loadingPage";
import DownloadOrNotify from "../components/photo-vault/downloadOrNotify";
import GoBackButton from "../components/shared/Buttons/GoBackButton";
import { firebase } from "../util/firestore";

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
      intialLoading: false,
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
      totalNewImagesSize: 0,
      uploadProgress: 0,
      uploadResponse: "",
    };
  }

  async componentDidMount() {
    await this.props.getVault(this.props.match.params.orderID).then(() => {
      this.setState({
        intialLoading: true,
        access: this.props.vault.access,
        images: this.props.vault.vaultData.images,
        notifiedCustomer: this.props.vault.vaultData.notifiedCustomer,
        confirmedByCustomer: this.props.vault.vaultData.confirmedByCustomer,
      });
    });
    this.state.images &&
      (await this.props.getSize(this.props.match.params.orderID).then(() => {
        this.setState(
          {
            imageSizes: Object.values(this.props.vault.vaultSize),
          },
          this.setSize()
        );
      }));
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
    let totalNewImagesSize = 0;

    if (images) {
      for (let i = 0; i < images.length; i++) {
        imageUrls.push(URL.createObjectURL(images[i]));
        newImages.push(images[i]);
        newImageSizes.push(images[i].size);
        totalNewImagesSize += images[i].size;
      }

      this.setState(
        {
          images: imageUrls,
          imagesToUpload: newImages,
          imageSizes: newImageSizes,
          disabled: false,
          totalNewImagesSize,
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

    if (this.state.imagesToDelete.length > 0) {
      await this.props.deleteImages(
        this.props.match.params.orderID,
        this.state.imagesToDelete
      );
      if (this.state.imagesToUpload.length === 0) {
        this.setState({
          openProgress: false,
          open: true,
        });
      }
    }
    if (this.state.imagesToUpload.length > 0) {
      const promises = [];
      const imageNames = [];

      const totalSize = this.state.totalNewImagesSize;
      const that = this;
      const metadata = {
        contentType: "image/jpeg",
      };

      this.state.imagesToUpload.forEach((image) => {
        const imageName = nanoid(10);
        imageNames.push(imageName);

        var task = firebase
          .storage()
          .ref(this.props.match.params.orderID)
          .child(imageName)
          .put(image, metadata);

        promises.push(task);

        task.on(
          "state_changed",
          function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred / totalSize) * 100;
            that.setState({
              uploadProgress: percentage,
            });
          },
          function error(err) {
            that.setState({
              uploadResponse: "Failed to upload images.",
            });
          }
        );
      });

      Promise.all(promises)
        .then(() => {
          this.props.uploadToVault(this.props.match.params.orderID, imageNames);
          this.setState({
            open: true,
            uploadResponse: "Successfully uploaded images.",
          });
        })
        .catch((err) => console.log(err.code));
    }
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
    const { classes, fullScreen } = this.props;
    return (
      <div className={classes.pageContainer}>
        {this.state.intialLoading ? (
          this.state.access ? (
            <Paper>
              <Grid container style={{ padding: 10 }}>
                <Grid item md={3} sm={12} xs={12} style={{ paddingBottom: 25 }}>
                  <GoBackButton
                    {...this.props}
                    disabled={this.state.openProgress}
                  />
                  {fullScreen && (
                    <div style={{ float: "right" }}>
                      <DownloadOrNotify
                        access={this.state.access}
                        openProgress={this.state.openProgress}
                        notifiedCustomer={this.state.notifiedCustomer}
                        loading={this.props.vault.loading}
                        confirmedByCustomer={this.state.confirmedByCustomer}
                        downloadDisable={this.state.downloadDisable}
                        openFinalizeDialog={this.openFinalizeDialog.bind(this)}
                        downloadImages={this.downloadImages.bind(this)}
                      />
                    </div>
                  )}
                </Grid>

                <Grid
                  item
                  md={6}
                  sm={12}
                  style={{ textAlign: "center", margin: "0 auto" }}
                >
                  <ProgressBar
                    totalSize={this.state.totalSize}
                    setSize={this.setSize.bind(this)}
                  />
                </Grid>

                {!fullScreen && (
                  <Grid item md={3} style={{ textAlign: "right" }}>
                    <DownloadOrNotify
                      access={this.state.access}
                      openProgress={this.state.openProgress}
                      notifiedCustomer={this.state.notifiedCustomer}
                      loading={this.props.vault.loading}
                      confirmedByCustomer={this.state.confirmedByCustomer}
                      downloadDisable={this.state.downloadDisable}
                      openFinalizeDialog={this.openFinalizeDialog.bind(this)}
                      downloadImages={this.downloadImages.bind(this)}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  {this.state.images?.length > 0 ? (
                    <ImageGrid
                      images={this.state.images}
                      deleteImage={this.deleteImage.bind(this)}
                      access={this.state.access}
                    />
                  ) : (
                    <Typography
                      variant="subtitle2"
                      style={{ margin: "75px 0", textAlign: "center" }}
                    >
                      No images to display
                    </Typography>
                  )}
                </Grid>
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
                fullScreen={fullScreen}
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
                fullScreen={fullScreen}
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
                value={Number.parseFloat(this.state.uploadProgress).toFixed(0)}
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
                    {this.state.uploadResponse && (
                      <Typography>{this.state.uploadResponse}</Typography>
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
          )
        ) : (
          <LoadingPage />
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
