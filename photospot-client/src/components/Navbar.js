import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";

import AppIcon from "../images/logo.png";

//Material UI
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { AccountCircle } from "@material-ui/icons";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

// Redux
import { logoutUser } from "../redux/actions/userActions";
import { useSelector, useDispatch } from "react-redux";

const Navbar = () => {
  const authenticated = useSelector((state) => state.user.authenticated);
  // const details = useSelector((state) => state.user.credentials);
  // const { photographer } = authenticated ? details[0] : false;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const container = {
    width: "1000px",
    margin: "auto",
  };

  const imageStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  };

  const centerGrid = {
    textAlign: "center",
  };

  return (
    <AppBar>
      <Toolbar>
        <div style={{ width: 1000, height: "50px", margin: "auto" }}>
          <Box display="flex" p={1}>
            <Box p={1} flexGrow={1}>
              <IconButton
                edge="start"
                style={{ padding: 0, marginTop: "-10px" }}
                component={Link}
                to="/"
              >
                <img src={AppIcon} alt="Logo" style={imageStyle} />
              </IconButton>
            </Box>

            <Box p={1}>
              <IconButton
                style={{ padding: 0, marginTop: "-10px" }}
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle fontSize="large" />
              </IconButton>
            </Box>

            {authenticated && (
              <div>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem component={Link} to="/profile">
                    Profile
                  </MenuItem>

                  <MenuItem component={Link} to="/yourPhotographyProfile">
                    Photographer Page
                  </MenuItem>

                  <MenuItem onClick={() => dispatch(logoutUser())}>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            )}

            {!authenticated && (
              <div>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem component={Link} to="/login">
                    Login
                  </MenuItem>

                  <MenuItem component={Link} component={Link} to="/signup">
                    Signup
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Box>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Navbar);
