import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";

export class rating extends Component {
  render() {
    const { reviewCount, totalRating } = this.props;
    return (
      <Typography
        variant="subtitle2"
        style={{ fontSize: "110%", height: "25px" }}
      >
        <span style={{ fontSize: "130%", color: "#23ba8b" }}>&#9733;</span>{" "}
        {Math.round((totalRating / reviewCount) * 10) / 10} ({reviewCount})
      </Typography>
    );
  }
}

export default rating;
