import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import withStyles from "@material-ui/core/styles/withStyles";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";

const styles = (theme) => ({
  ...theme.spreadThis,
  imageHolder: { position: "relative" },

  deleteButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 0,
  },
});

const ColorIconButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(theme.palette.secondary.dark),
    backgroundColor: theme.palette.secondary.dark,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
}))(IconButton);

export class imageGrid extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      startIndex: 0,
    };
  }

  toggleLightBox() {
    this.setState({
      open: !this.state.open,
    });
  }

  openImageLightBox(id) {
    console.log(id);
    this.setState({
      open: true,
      startIndex: id,
    });
  }

  render() {
    const { images, classes, access } = this.props;

    var imageContainer = [];
    var lightboxImages = [];

    for (var i = 0; i < images?.length; i++) {
      var img = new Image();
      img.src = images[i];
      const id = i;
      lightboxImages.push({ url: img.src, title: i });
      imageContainer.push(
        <Grid item sm={6} xs={12}>
          <div className={classes.imageHolder}>
            <Button
              onClick={() => this.openImageLightBox(id)}
              style={{ padding: 0 }}
            >
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
            </Button>
            {access === "photographer" && (
              <ColorIconButton
                onClick={() => this.props.deleteImage(id)}
                className={classes.deleteButton}
                color="secondary"
              >
                <CancelIcon />
              </ColorIconButton>
            )}
          </div>
        </Grid>
      );
    }

    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12} className={this.props.classes.centerGrid}>
            <Button
              style={{ marginTop: 15 }}
              color="secondary"
              onClick={() => this.toggleLightBox()}
            >
              OPEN IMAGES
            </Button>
          </Grid>
          {imageContainer}
          {this.state.open && (
            <Lightbox
              images={lightboxImages}
              startIndex={this.state.startIndex}
              onClose={() => this.toggleLightBox()}
            />
          )}
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(imageGrid);
