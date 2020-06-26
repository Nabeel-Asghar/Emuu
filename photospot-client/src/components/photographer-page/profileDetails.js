import React, { Component } from "react";

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
    const { firstName, lastName } = this.props;

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
