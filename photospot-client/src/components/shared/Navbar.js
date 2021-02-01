import { Hidden } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import Slide from "@material-ui/core/Slide";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import qs from "qs";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, withRouter } from "react-router-dom";
import AppIcon from "../../images/logo.png";
import { logoutUser } from "../../redux/actions/userActions";

const useStyles = makeStyles((theme) => ({
  box: {
    padding: "0px",
    margin: "0px",
    maxWidth: 500,
  },
  button: {
    marginTop: 23,
    marginBottom: 10,
    [theme.breakpoints.down("xs")]: {
      marginTop: 5,
    },
  },
  input: { width: "100%", paddingLeft: "20px" },
  iconButton: { padding: "10px" },

  imageStyle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
  searchBox: {
    height: "38px",
    borderRadius: 25,
    padding: "0px 4px",
    display: "flex",
    alignItems: "center",
    margin: "0 auto",
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = (props) => {
  const classes = useStyles();

  const authenticated = useSelector((state) => state.user.authenticated);
  const details = useSelector((state) => state.user.credentials);

  //Algolia
  const location = useLocation();
  const urlToSearchState = (location) => qs.parse(location.search.slice(1));
  const [query, setName] = useState("");
  const [urlQuery] = useState(urlToSearchState(location).query);

  let photographerStatus = false;
  let avatarUrl = "";

  if (authenticated && details[0]) {
    const { photographer } = details[0];
    const { thumbnailImage } = details[0];
    photographerStatus = photographer;
    avatarUrl = thumbnailImage;
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
    props.history.push("/search/?" + qs.stringify(objValues) + "&page=1");
  };

  return (
    <HideOnScroll {...props}>
      <AppBar
        style={{
          visibility:
            window.location.pathname === "/login" ||
            window.location.pathname === "/signup"
              ? "hidden"
              : "visible",
        }}
      >
        <Toolbar>
          <Grid container alignItems="center" justify="center">
            <Grid item xs={2} sm={3}>
              <IconButton
                edge="start"
                style={{ backgroundColor: "transparent" }}
                component={Link}
                to="/"
              >
                <img src={AppIcon} alt="Logo" className={classes.imageStyle} />
                <Hidden smDown>
                  <Typography>
                    <Box fontWeight="fontWeightBold" fontSize="h6.fontSize">
                      &nbsp; PhotoSpot
                    </Box>
                  </Typography>
                </Hidden>
              </IconButton>
            </Grid>

            <Grid item xs={8} sm={6} align="center">
              <Box
                width="100%"
                border={2}
                borderRadius={25}
                borderColor="secondary"
                className={classes.box}
                style={{
                  visibility:
                    window.location.pathname === "/login" ||
                    window.location.pathname === "/signup" ||
                    window.location.pathname === "/"
                      ? "hidden"
                      : "visible",
                }}
              >
                <Paper className={classes.searchBox}>
                  <InputBase
                    id="query"
                    className={classes.input}
                    name="query"
                    label="Feature"
                    defaultValue={urlQuery}
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

            <Grid item xs={2} sm={3} align="right">
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <Hidden xsDown>
                  <MenuIcon fontSize="large" />
                </Hidden>
                <Avatar alt="Remy Sharp" src={avatarUrl} />
              </IconButton>
            </Grid>

            {authenticated && (
              <div>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  getContentAnchorEl={null}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  keepMounted
                  open={open}
                  onClose={handleClose}
                >
                  {!photographerStatus && (
                    <MenuItem
                      onClick={handleClose}
                      component={Link}
                      to="/userDashboard"
                    >
                      Dashboard
                    </MenuItem>
                  )}

                  {photographerStatus && (
                    <div>
                      <MenuItem
                        onClick={handleClose}
                        component={Link}
                        to="/photographerDashboard"
                      >
                        Dashboard
                      </MenuItem>

                      <MenuItem
                        onClick={handleClose}
                        component={Link}
                        to="/yourPhotographyProfile"
                      >
                        Photographer Page
                      </MenuItem>
                    </div>
                  )}

                  <MenuItem
                    onClick={handleClose}
                    component={Link}
                    to="/messaging"
                  >
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
                  keepMounted
                  open={open}
                  onClose={handleClose}
                  anchorEl={anchorEl}
                  getContentAnchorEl={null}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <MenuItem onClick={handleClose} component={Link} to="/login">
                    Login
                  </MenuItem>

                  <MenuItem onClick={handleClose} component={Link} to="/signup">
                    Signup
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default withRouter(Navbar);
