import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Redirect } from "react-router-dom";

// Redux
import { connect } from "react-redux";
import {
  getVault,
  getDownload,
  uploadToVault,
} from "../redux/actions/vaultActions";

// Material UI
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SaveIcon from "@material-ui/icons/Save";
import CircularProgress from "@material-ui/core/CircularProgress";

// Components
import ImageGrid from "../components/imageGrid";
import GoBackButton from "../components/goBackButton";
import ProgressBar from "../components/photo-vault/progressBar";

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
      images: [],
      imagesToUpload: [],
      imagesToDelete: [],
      completed: 50,
    };
  }

  componentDidMount() {
    this.props.getVault(this.props.match.params.orderID).then(() => {
      this.setState({
        access: this.props.vault.access,
        images: this.props.vault.vaultData.images,
      });
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

  handleImageAdd = async (event) => {
    const images = event.target.files;
    let imageUrls = this.state.images;
    let newImages = this.state.imagesToUpload;

    if (images) {
      for (let i = 0; i < images.length; i++) {
        console.log(URL.createObjectURL(images[i]));
        imageUrls.push(URL.createObjectURL(images[i]));
        newImages.push(images[i]);
        // console.log("GB: ", event.target.files[0].size / Math.pow(1024, 3));
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

  downloadImages() {
    this.props.getDownload(this.props.match.params.orderID);
  }

  handleSubmit() {
    const formData = new FormData();

    this.state.imagesToUpload.forEach((image) => {
      formData.append("image", image, image.name);
    });

    this.props.uploadToVault(this.props.match.params.orderID, formData);
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper>
        <Grid container>
          <ProgressBar completed={this.state.completed} />
          {this.state.images && (
            <ImageGrid
              images={this.state.images}
              deleteImage={this.deleteImage.bind(this)}
            />
          )}
          <Grid item xs={12}>
            <div className={classes.root}>
              <GoBackButton {...this.props} />
              <Button
                color="secondary"
                variant="contained"
                onClick={() => this.downloadImages()}
              >
                Download
              </Button>
              <Button
                variant="outlined"
                color="secondary"
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
                startIcon={<SaveIcon />}
                onClick={() => this.handleSubmit()}
              >
                Save Changes
              </Button>
            </div>
          </Grid>
        </Grid>
      </Paper>
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
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(photoVault));
