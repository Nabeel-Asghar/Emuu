import React, { Component } from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";

const styles = (theme) => ({
  ...theme.spreadThis,
});

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
