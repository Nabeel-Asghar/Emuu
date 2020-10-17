import React, { Component } from "react";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const styles = () => ({
  imageStyle: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "cover",
  },
});

export class imageGrid extends Component {
  render() {
    const { images, classes } = this.props;

    var imageContainer = [];

    for (var i = 0; i < images.length; i++) {
      var img = new Image();
      img.src = images[i];
      const id = i;
      imageContainer.push(
        <Grid item xs={4}>
          <Button onClick={() => this.props.deleteImage(id)}>X</Button>
          <img
            key={i}
            src={img.src}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "cover",
              pointerEvents: "none",
            }}
          />
        </Grid>
      );
    }

    return (
      <div>
        <Grid container spacing={2}>
          {imageContainer}
        </Grid>
      </div>
    );
  }
}

export default imageGrid;
