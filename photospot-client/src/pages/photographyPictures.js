import React, { Component } from "react";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class photographyPictures extends Component {
  constructor() {
    super();
    this.state = {
      images: [],
    };
  }

  componentDidMount() {
    this.setState({
      images: this.props.location.state.images,
    });
  }

  deleteImage(id) {
    console.log(this.state.images);
    var array = this.state.images;
    array.splice(id, 1);
    this.setState({
      images: array,
    });
  }

  render() {
    const { classes } = this.props;

    console.log(this.state.images);

    var imageContainer = [];

    for (var i = 0; i < this.state.images.length; i++) {
      var img = new Image();
      img.src = this.state.images[i];
      const id = i;
      console.log(img.src);
      imageContainer.push(
        <Grid item xs={4}>
          <Button onClick={() => this.deleteImage(id)}>X</Button>
          <img key={i} src={img.src} className={classes.horseShit} />
        </Grid>
      );
    }

    return (
      <Paper>
        {imageContainer}
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          onChange={this.props.handleBackgroundChange}
        />
      </Paper>
    );
  }
}

export default withStyles(styles)(photographyPictures);
