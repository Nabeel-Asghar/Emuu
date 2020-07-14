import React, { Component } from "react";

// Redux
import { connect } from "react-redux";
import { getUserData, uploadProfileImage } from "../redux/actions/userActions";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import ImageUploader from "react-images-upload";

const styles = (theme) => ({
  ...theme.spreadThis,
});

class profileImage extends Component {
  constructor() {
    super();
    this.state = { profileImage: "" };
    this.onDrop = this.onDrop.bind(this);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const image = this.state.profileImage[0];
    console.log(image);
    const formData = new FormData();
    formData.append("image", image, image.name);
    this.props.uploadProfileImage(formData);
  };

  onDrop(picture) {
    console.log(picture);
    this.setState({
      profileImage: picture,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid item xs={12} className={classes.centerGrid}>
          <ImageUploader
            withIcon={true}
            buttonText="Choose Profile Image"
            onChange={this.onDrop}
            imgExtension={[".jpg", ".gif", ".png", ".gif"]}
            maxFileSize={5242880}
            withPreview={true}
            singleImage={false}
            withLabel={false}
          />
          <Button onClick={this.handleSubmit}>Upload</Button>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  credentials: state.user.credentials,
});

const mapActionsToProps = {
  getUserData,
  uploadProfileImage,
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(profileImage));
