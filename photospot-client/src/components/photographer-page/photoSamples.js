import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Skeleton from "@material-ui/lab/Skeleton";
import Gallery from "react-photo-gallery";
import Button from "@material-ui/core/Button";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import IconButton from "@material-ui/core/IconButton";

import equal from "fast-deep-equal";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class photoSamples extends Component {
  constructor() {
    super();
    this.state = {
      photoIndex: 0,
      isOpen: false,
      imageContainer: [],
      lightboxImages: [],
    };
  }

  handleImage = () => {
    let gridImages = [];

    this.setState({
      lightboxImages: this.props.images,
    });

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
    }

    this.setState({ imageContainer: gridImages });
  };

  render() {
    const { classes, images, loading } = this.props;
    let gridImages = [];
    for (var i = 0; i < this.props.images.length; i++) {
      gridImages.push(
        <img
          hidden
          src={this.props.images[i]}
          onLoad={() => this.handleImage()}
        />
      );
    }

    // var imageContainer = [];
    // var lightboxImages = [];

    const { photoIndex, isOpen } = this.state;
    return (
      <div>
        {loading ? (
          <Skeleton variant="rect" height={500} width={500} />
        ) : (
          <div>
            <Button
              style={{ padding: "10px 0 10px 0" }}
              fullWidth
              onClick={() => this.setState({ isOpen: true })}
            >
              Open Images
            </Button>

            {isOpen && (
              <Lightbox
                mainSrc={this.state.lightboxImages[photoIndex]}
                nextSrc={
                  this.state.lightboxImages[
                    (photoIndex + 1) % this.state.lightboxImages.length
                  ]
                }
                prevSrc={
                  this.state.lightboxImages[
                    (photoIndex + this.state.lightboxImages.length - 1) %
                      this.state.lightboxImages.length
                  ]
                }
                onCloseRequest={() => this.setState({ isOpen: false })}
                onMovePrevRequest={() =>
                  this.setState({
                    photoIndex:
                      (photoIndex + this.state.lightboxImages.length - 1) %
                      this.state.lightboxImages.length,
                  })
                }
                onMoveNextRequest={() =>
                  this.setState({
                    photoIndex:
                      (photoIndex + 1) % this.state.lightboxImages.length,
                  })
                }
              />
            )}

            <Gallery photos={this.state.imageContainer} />
          </div>
        )}
        {gridImages}
      </div>
    );
  }
}

export default withStyles(styles)(photoSamples);
