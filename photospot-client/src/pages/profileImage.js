import React, { Component } from "react";

// Redux
import { connect } from "react-redux";
import { getUserData } from "../redux/actions/userActions";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

// Check if props updated
import equal from "fast-deep-equal";

import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class profileImage extends Component {
  constructor() {
    super();
    this.state = {
      src: null,
      errors: {},
      crop: {
        unit: "%",
        width: 30,
        aspect: 1 / 1,
      },
    };
  }

  //   handleImageChange = (event) => {
  //     const image = event.target.files[0];
  //     const localImageUrl = window.URL.createObjectURL(image);
  //     this.setState({ profileImage: localImageUrl });
  //     console.log(this.state.profileImage);
  //   };

  //   handleEditPicture = () => {
  //     const fileInput = document.getElementById("imageInput");
  //     fileInput.click();
  //   };

  assignStates = (key, value) => {
    this.setState({
      [key]: value,
    });
  };

  assignValues(details) {
    const userDetails = Object.values(details);

    userDetails.forEach((task) =>
      Object.entries(task).forEach(([key, value]) => {
        this.assignStates(key, value);
      })
    );
  }

  componentDidMount() {
    this.props.getUserData();
    const userDetails = this.props.credentials;
    this.assignValues(userDetails);
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.credentials, prevProps.credentials)) {
      this.assignValues(this.props.credentials);
    }
  }

  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        this.setState({ src: reader.result })
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // If you setState the crop in here you should return false.
  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // You could also use percentCrop:
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid item xs={12} className={classes.centerGrid}>
          {/* <img src={this.state.profileImage} alt="Profile" /> */}
        </Grid>
        <Grid item xs={12} className={classes.centerGrid}>
          <div>
            <input type="file" accept="image/*" onChange={this.onSelectFile} />
          </div>
          {this.state.src && (
            <ReactCrop
              src={this.state.src}
              crop={this.state.crop}
              ruleOfThirds
              onImageLoaded={this.onImageLoaded}
              onComplete={this.onCropComplete}
              onChange={this.onCropChange}
            />
          )}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
});

const mapActionsToProps = {
  getUserData,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(profileImage));
