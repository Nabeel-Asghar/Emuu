import React, { Component } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

class loadingPage extends Component {
  render() {
    return (
      <Backdrop
        style={{ zIndex: "theme.zIndex.drawer + 1", color: "#fff" }}
        open={true}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
    );
  }
}

export default loadingPage;
