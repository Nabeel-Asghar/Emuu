import React, { Component } from "react";
import { Link } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

const styles = {
  img: {
    maxWidth: "150px",
    width: "100%",
    height: "auto",
    align: "right",
  },
};

class profileDetails extends Component {
  render() {
    const { classes, firstName, lastName } = this.props;

    return (
      <div>
        <Typography variant="h4">
          {firstName} {lastName}
        </Typography>
      </div>
    );
  }
}

export default withStyles(styles)(profileDetails);
