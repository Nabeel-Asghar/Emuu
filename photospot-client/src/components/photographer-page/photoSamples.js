import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Skeleton from "@material-ui/lab/Skeleton";
import Gallery from "react-photo-gallery";
import Button from "@material-ui/core/Button";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import OpenWithIcon from "@material-ui/icons/OpenWith";
import IconButton from "@material-ui/core/IconButton";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class photoSamples extends Component {
  constructor() {
    super();
    this.state = {
      photoIndex: 0,
      isOpen: false,
    };
  }

  render() {
    const { classes, images, loading } = this.props;

    var imageContainer = [];
    var lightboxImages = [];

    for (var i = 0; i < images.length; i++) {
      var img = new Image();
      img.src = images[i];

      let width = Math.ceil(img.width / 100);
      let height = Math.ceil(img.height / 100);

      lightboxImages.push(img.src);

      imageContainer.push({
        src: img.src,
        width: width,
        height: height,
      });
    }
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
                mainSrc={lightboxImages[photoIndex]}
                nextSrc={
                  lightboxImages[(photoIndex + 1) % lightboxImages.length]
                }
                prevSrc={
                  lightboxImages[
                    (photoIndex + lightboxImages.length - 1) %
                      lightboxImages.length
                  ]
                }
                onCloseRequest={() => this.setState({ isOpen: false })}
                onMovePrevRequest={() =>
                  this.setState({
                    photoIndex:
                      (photoIndex + lightboxImages.length - 1) %
                      lightboxImages.length,
                  })
                }
                onMoveNextRequest={() =>
                  this.setState({
                    photoIndex: (photoIndex + 1) % lightboxImages.length,
                  })
                }
              />
            )}

            <Gallery photos={imageContainer} />
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(photoSamples);
