import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Skeleton from "@material-ui/lab/Skeleton";

class rating extends Component {
  render() {
    const { classes, loading } = this.props;
    return (
      <div>
        {loading ? (
          <Skeleton
            animation="wave"
            height={30}
            width={100}
            style={{ marginBottom: 6 }}
          />
        ) : (
          <Typography>
            &#9733;&#9733;&#9733;&#9733;&#9733; - 15 Reviews
          </Typography>
        )}
      </div>
    );
  }
}

export default rating;
