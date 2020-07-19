import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";

//Material UI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { AccountCircle } from "@material-ui/icons";

// Redux
import { logoutUser } from "../redux/actions/userActions";
import { useSelector, useDispatch } from "react-redux";

const Navbar = () => {
  const authenticated = useSelector((state) => state.user.authenticated);
  const details = useSelector((state) => state.user.credentials);
  const { photographer } = authenticated ? details[0] : false;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar>
      <Toolbar className="nav-container">
        {!authenticated && (
          <div>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/signup">
              Signup
            </Button>
          </div>
        )}

        <Button color="inherit" component={Link} to="/">
          Home
        </Button>

        {authenticated && (
          <div>
            {/* <Button
              color="inherit"
              component={Link}
              to="/yourPhotographyProfile"
            >
              Your Photographer Profile
            </Button> */}
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem component={Link} to="/profile">
                Profile
              </MenuItem>
              {photographer && (
                <MenuItem component={Link} to="/yourPhotographyProfile">
                  Photographer Page
                </MenuItem>
              )}
              <MenuItem onClick={() => dispatch(logoutUser())}>Logout</MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Navbar);
