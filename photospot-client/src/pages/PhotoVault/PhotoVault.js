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
  handleDispute,
} from "../../redux/actions/vaultActions";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import Typography from "@material-ui/core/Typography";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { TextField } from "@material-ui/core";

// Components
import ImageGrid from "../../components/Shared/ImageGrid";
import ProgressBar from "../../components/PhotoVault/ProgressBar";
import Success from "../../components/Shared/Success";
import Progress from "../../components/Shared/Progress";
import Confirmation from "../../components/Shared/Confirmation";
import LoadingPage from "../../components/Shared/LoadingPage";
import DownloadOrNotify from "../../components/PhotoVault/DownloadOrNotify";
import GoBackButton from "../../components/Shared/Buttons/GoBackButton";
import { firebase } from "../../util/Firestore";
import CancelButton from "../../components/Shared/Buttons/CancelButton";

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
      disputeReason: null,
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
      openDisputeDialog: false,
      openSuccessDispute: false,
      dispute: "",
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
        disputeReason: this.props.vault.vaultData.disputeReason,
      });
    });

    if (this.state.access) {
      this.setState({
        intialImagesLength:
          this.props.vault.vaultData.images &&
          this.props.vault.vaultData.images.length,
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

        const task = firebase
          .storage()
          .ref()
          .child(`vaults/${this.props.match.params.orderID}/${imageName}`)
          .put(image, metadata);

        promises.push(task);

        task.on(
          "state_changed",
          function progress(snapshot) {
            const percentage =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(
              "total",
              snapshot.totalBytes / 1000000,
              totalSize / 1000000
            );
            if (percentage > that.state.uploadProgress) {
              that.setState({
                uploadProgress: percentage,
              });
            }
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

  handleDispute() {
    this.props
      .handleDispute(this.props.match.params.orderID, {
        disputeReason: this.state.dispute,
      })
      .then(() => {
        this.closeDialog();
        this.setState({
          openSuccessDispute: true,
        });
      })
      .catch(() => {
        //handle error
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
  closeDialog() {
    this.setState({
      openDialog: false,
      openCustomerFinal: false,
      openCustcloseFinalizeDialogomerFinal: false,
      openDisputeDialog: false,
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
                    notifiedCustomer={this.state.notifiedCustomer}
                    confirmedByCustomer={this.state.confirmedByCustomer}
                    disputeReason={this.state.disputeReason}
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
                        <>
                          <CancelButton
                            variant="contained"
                            color="secondary"
                            startIcon={<CancelIcon />}
                            onClick={() =>
                              this.setState({ openDisputeDialog: true })
                            }
                            disabled={this.state.disputeReason}
                          >
                            Open Dispute
                          </CancelButton>
                          <Button
                            variant="contained"
                            color="secondary"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => this.openFinalizeDialog()}
                            disabled={this.state.disputeReason}
                          >
                            Confirm Pictures
                          </Button>
                        </>
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
                handleDisagree={() => this.closeDialog()}
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
                handleDisagree={() => this.closeDialog()}
                title="Confirm Pictures"
                text={
                  "This will pay your photographer and finalize your shoot. You will be allowed to download photos in this vault after confirming."
                }
                label="This is not reversable. Are you sure you want to do this?"
              />

              <Confirmation
                open={this.state.openDisputeDialog}
                fullScreen={fullScreen}
                secondaryConfirmation={true}
                handleAgree={() => this.handleDispute()}
                handleDisagree={() => this.closeDialog()}
                title="Dispute Photos?"
                text={
                  <div>
                    <Typography gutterBottom style={{ paddingBottom: "10px" }}>
                      Are these not the photos that you asked for? Have you
                      tried to contact your photographer?{" "}
                    </Typography>

                    <Typography gutterBottom style={{ paddingBottom: "10px" }}>
                      If not, you will be able to open up a dispute. The payment
                      to the photographer will be paused,{" "}
                      <b>this may take up to a week.</b>
                    </Typography>

                    <TextField
                      color="secondary"
                      label="Dispute Reason"
                      placeholder="Please enter a short sentence to explain."
                      value={this.state.dispute}
                      onChange={(e) =>
                        this.setState({ dispute: e.target.value })
                      }
                      fullWidth
                      style={{ paddingBottom: 10 }}
                    />
                  </div>
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

              <Success
                open={this.state.openSuccessDispute}
                headline="Success!"
                body={<Typography>Successfully submitted dispute.</Typography>}
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
  handleDispute,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(photoVault));