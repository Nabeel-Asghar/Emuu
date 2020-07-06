import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Gallery from "react-photo-gallery";
import Carousel from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";
import ImageGallery from "react-image-gallery";

import "react-image-gallery/styles/css/image-gallery.css";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class photoSamples extends Component {
  render() {
    const { classes, images } = this.props;

    var imageContainer = [];

    return <ImageGallery items={imageslist} showPlayButton={false} />;
  }
}

export default withStyles(styles)(photoSamples);
