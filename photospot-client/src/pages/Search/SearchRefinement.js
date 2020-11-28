import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import ConnectedRefinementList from "./ConnectedRefinementList";

class SearchRefinement extends Component {
  render() {
    return (
      <div style={{ padding: "0px 25px" }}>
        <Typography variant="h6" style={{ fontWeight: "bold" }} gutterBottom>
          {this.props.header}
        </Typography>
        <ConnectedRefinementList attribute={this.props.attribute} />
      </div>
    );
  }
}

export default SearchRefinement;
