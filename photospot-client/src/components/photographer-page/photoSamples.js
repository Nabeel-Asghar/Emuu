import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import ImageGallery from "react-image-gallery";

import "react-image-gallery/styles/css/image-gallery.css";
import Skeleton from "@material-ui/lab/Skeleton";

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

      imageContainer.push({
        original: img.src,
        thumbnail: img.src,
      });
    }

    return (
      <div>
        {loading ? (
          <Skeleton variant="rect" height={500} width={500} />
        ) : (
          <ImageGallery items={imageContainer} showPlayButton={false} />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(photoSamples);
