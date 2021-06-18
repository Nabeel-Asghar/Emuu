import React, { Component } from "react";
import { Link } from "react-router-dom";

class NotFound extends Component {
  render() {
    return (
      <div>
        <center>
          <h1>404 - Not Found!</h1>
          <Link to="/">Go Home</Link>
        </center>
      </div>
    );
  }
}

export default NotFound;
