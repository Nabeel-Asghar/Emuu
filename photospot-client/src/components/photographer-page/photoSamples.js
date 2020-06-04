import React, { Component } from "react";
import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

import Carousel, { Dots } from "@brainhubeu/react-carousel";
import "@brainhubeu/react-carousel/lib/style.css";

const styles = {
  img: {
    maxWidth: "150px",
    width: "100%",
    height: "auto",
  },
};

class photoSamples extends Component {
  render() {
    const { classes, images } = this.props;

    return (
      <div>
        {/* <Carousel slidesPerPage={4} arrows infinite> */}

        {images.forEach((image) => {
          console.log(image);
          return (
            <img
              src={
                "https://firebasestorage.googleapis.com/v0/b/photospot-5f554.appspot.com/o/498732913.jpg?alt=media"
              }
            />
          );
        })}

        {/* <img src={imageOne} />
            <img src={imageTwo} />
            <img src={imageThree} /> */}
        {/* </Carousel> */}
      </div>
    );
  }
}

export default withStyles(styles)(photoSamples);
