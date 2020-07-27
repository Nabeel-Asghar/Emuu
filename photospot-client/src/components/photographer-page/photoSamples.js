import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Skeleton from "@material-ui/lab/Skeleton";
import Gallery from "react-photo-gallery";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class photoSamples extends Component {
  render() {
    const { classes, images, loading } = this.props;

    var imageContainer = [];

    for (var i = 0; i < images.length; i++) {
      var img = new Image();
      img.src = images[i];

      let width = Math.ceil(img.width / 100);
      let height = Math.ceil(img.height / 100);

      console.log(width, height);

      imageContainer.push({
        src: img.src,
        width: width,
        height: height,
      });
    }

    return (
      <div>
        {loading ? (
          <Skeleton variant="rect" height={500} width={500} />
        ) : (
          <Gallery photos={imageContainer} />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(photoSamples);
