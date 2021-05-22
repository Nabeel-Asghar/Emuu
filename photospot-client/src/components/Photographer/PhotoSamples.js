import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Skeleton from "@material-ui/lab/Skeleton";
import Gallery from "react-photo-gallery";
import Button from "@material-ui/core/Button";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class photoSamples extends Component {
  constructor() {
    super();
    this.state = {
      photoIndex: 0,
      open: false,
      imageContainer: [],
      lightboxImages: [],
    };
  }

  handleImage = () => {
    let gridImages = [];
    let lightboxImages = [];

    for (var i = 0; i < this.props.images.length; i++) {
      var img = new Image();
      img.src = this.props.images[i];

      let width = Math.ceil(img.width / 100);
      let height = Math.ceil(img.height / 100);

      gridImages.push({
        src: img.src,
        width: width,
        height: height,
      });

      lightboxImages.push({ url: img.src, title: i });
    }

    this.setState({
      imageContainer: gridImages,
      lightboxImages: lightboxImages,
    });
  };

  openLightBox() {
    this.setState({
      open: true,
    });
  }

  closeLightBox() {
    this.setState({
      open: false,
      photoIndex: 0,
    });
  }

  openImage = (event, { photo, index }) => {
    this.setState({ photoIndex: index }, this.openLightBox);
  };

  openImageProp = this.openImage.bind(this);

  render() {
    const { classes, images, loading } = this.props;
    let gridImages = [];
    for (var i = 0; i < images.length; i++) {
      gridImages.push(
        <img hidden src={images[i]} onLoad={() => this.handleImage()} />
      );
    }

    return (
      <div>
        <Button
          style={{ padding: "10px 0px" }}
          fullWidth
          onClick={() => this.openLightBox()}
        >
          Open Images
        </Button>

        {this.state.open && (
          <Lightbox
            images={this.state.lightboxImages}
            startIndex={this.state.photoIndex}
            onClose={() => this.closeLightBox()}
          />
        )}

        <Gallery
          photos={this.state.imageContainer}
          onClick={this.openImageProp}
        />
        {gridImages}
      </div>
    );
  }
}

export default withStyles(styles)(photoSamples);
