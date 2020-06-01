import React, { Component } from "react";
import { Link } from "react-router-dom";

//Material UI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

// Redux
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../redux/actions/userActions";

export class Navbar extends Component {
  render() {
    return (
      <AppBar>
        <Toolbar className="nav-container">
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/signup">
            Signup
          </Button>
          <Button
            color="inherit"
            component={Link}
            to="/login"
            onClick={() => {
              this.props.logoutUser();
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
};

const mapActionsToProps = {
  logoutUser,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

export default connect(mapStateToProps, mapActionsToProps)(Navbar);
