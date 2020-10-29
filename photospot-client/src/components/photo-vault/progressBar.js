import React, { Component } from "react";
import Box from "@material-ui/core/Box";
import RefreshIcon from "@material-ui/icons/Refresh";
import IconButton from "@material-ui/core/IconButton";

const containerStyles = {
  height: 20,
  width: 200,
  backgroundColor: "#e0e0de",
  borderRadius: 50,
  margin: "5px auto 10px auto",
};

class progressBar extends Component {
  constructor() {
    super();
    this.state = {
      theTotalSize: 0,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      theTotalSize: newProps.totalSize,
    });
  }

  render() {
    return (
      <Box
        border={2}
        borderRadius={16}
        borderColor="secondary.main"
        style={{ maxWidth: 250, margin: "0px auto" }}
      >
        {this.state.theTotalSize}/500 MB
        <IconButton onClick={() => this.props.setSize()} style={{ padding: 5 }}>
          <RefreshIcon />
        </IconButton>
        <div style={containerStyles}>
          <div
            style={{
              height: "100%",
              backgroundColor: "#23ba8b",
              borderRadius: "inherit",
              textAlign: "right",
              width: `${100 * (this.state.theTotalSize / 500)}%`,
            }}
          />
        </div>
      </Box>
    );
  }
}

export default progressBar;
