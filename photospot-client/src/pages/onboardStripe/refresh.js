import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Link } from "react-router-dom";

import { refreshStripe } from "../../redux/actions/paymentActions";

export class refresh extends Component {
  componentDidMount() {
    this.props.refreshStripe();
  }

  render() {
    return <div></div>;
  }
}

const mapStateToProps = (state) => ({});

const mapActionsToProps = {
  refreshStripe,
};

export default connect(mapStateToProps, mapActionsToProps)(refresh);
