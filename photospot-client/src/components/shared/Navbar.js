import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { AccountCircle } from "@material-ui/icons";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import AppIcon from "../../images/logo.png";
import { logoutUser } from "../../redux/actions/userActions";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import qs from "qs";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import SvgIcon from "@material-ui/core/SvgIcon";

const useStyles = makeStyles((theme) => ({
  box: {
    padding: "0px",
    margin: "0px",
  },
  button: {
    marginTop: 23,
    marginBottom: 10,
    [theme.breakpoints.down("xs")]: {
      marginTop: 5,
    },
  },
  input: { width: "250px", paddingLeft: "20px" },
  iconButton: { padding: "10px" },

  imageStyle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
  searchBox: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    margin: "0 auto",
  },
}));

const Navbar = (props) => {
  const classes = useStyles();

  const authenticated = useSelector((state) => state.user.authenticated);
  const details = useSelector((state) => state.user.credentials);
  const [query, setName] = useState("");

  const [showChild, setShowChild] = useState(false);
  // Allow photographer options if user is a photographer
  let photographerStatus = false;
  if (authenticated && details[0]) {
    const { photographer } = details[0];
    photographerStatus = photographer;
  }

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (evt) => {
    const target = evt.target;

    setName({
      ...query,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    });
  };

  const handleSubmit = (objValues) => {
    console.log("submitted");
    props.history.push("/search/?" + qs.stringify(objValues) + "&page=1");
  };

  return (
    <AppBar>
      <Toolbar>
        <Grid container alignItems="center" justify="center">
          <Grid item xs={4}>
            <IconButton
              edge="start"
              style={{ backgroundColor: "transparent" }}
              component={Link}
              to="/"
            >
              <img src={AppIcon} alt="Logo" className={classes.imageStyle} />
              <Typography>
                <Box fontWeight="fontWeightBold" fontSize="h6.fontSize">
                  &nbsp; PhotoSpot
                </Box>
              </Typography>
            </IconButton>
          </Grid>

          <Grid item xs={4} align="center">
            <Box
              width="fit-content"
              border={1}
              borderColor="secondary"
              className={classes.box}
            >
              <Paper className={classes.searchBox}>
                <InputBase
                  id="query"
                  className={classes.input}
                  name="query"
                  label="Feature"
                  inputStyle={{ textAlign: "center" }}
                  placeholder="Search"
                  onChange={handleChange}
                  color="secondary"
                  onKeyPress={(event) => {
                    if (event.key === "Enter") {
                      handleSubmit(query);
                    }
                  }}
                />
                <IconButton
                  className={classes.iconButton}
                  onClick={() => handleSubmit(query)}
                  color="secondary"
                >
                  <SearchIcon />
                </IconButton>
              </Paper>
            </Box>
          </Grid>

          <Grid item xs={4} align="right">
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <MenuIcon fontSize="large" />
              <AccountCircle color="secondary" fontSize="large" />
            </IconButton>
          </Grid>

          {authenticated && (
            <div>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                getContentAnchorEl={null}
              >
                {!photographerStatus && (
                  <MenuItem component={Link} to="/userDashboard">
                    Dashboard
                  </MenuItem>
                )}

                {photographerStatus && (
                  <div>
                    <MenuItem component={Link} to="/photographerDashboard">
                      Dashboard
                    </MenuItem>

                    <MenuItem component={Link} to="/yourPhotographyProfile">
                      Photographer Page
                    </MenuItem>
                  </div>
                )}

                <MenuItem component={Link} to="/messaging">
                  Messaging
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
                getContentAnchorEl={null}
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
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default withRouter(Navbar);
