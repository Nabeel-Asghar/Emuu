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

    const imageslist = [
      {
        original: "https://picsum.photos/id/1018/1000/600/",
        thumbnail: "https://picsum.photos/id/1018/250/150/",
      },
      {
        original: "https://picsum.photos/id/1015/1200/600/",
        thumbnail: "https://picsum.photos/id/1015/250/150/",
      },
      {
        original: "https://picsum.photos/id/1019/1000/500/",
        thumbnail: "https://picsum.photos/id/1019/250/150/",
      },
    ];

    return <ImageGallery items={imageslist} showPlayButton={false} />;
  }
}

export default withStyles(styles)(photoSamples);
