import { Slide } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import AppIcon from "../../images/logo.png";
import SignUpPhotographer from "../../components/SignUp/SignUpPhotographer";
import SignUpUser from "../../components/SignUp/SignUpUser";

const styles = (theme) => ({
  ...theme.spreadThis,
  signUpContainer: {
    [theme.breakpoints.down("sm")]: {
      marginTop: "-90px",
      marginBottom: "0px",
    },
    marginBottom: "80px",
  },
  typeButton: {
    height: "40px",
  },
  buttonGroup: {
    marginBottom: "15px",
  },
});

class signup extends Component {
  constructor() {
    super();
    this.state = { photographer: false };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      console.log(nextProps.UI.errors);
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handleToggleChange = (value) => {
    if (value === "photographer") {
      this.setState({ photographer: true });
    } else {
      this.setState({ photographer: false });
    }
  };

  render() {
    if (this.props.authenticated === true) {
      return <Redirect to="/" />;
    }
    const { classes } = this.props;

    return (
      <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={400}>
        <Grid container spacing={2} className={classes.signUpContainer}>
          <Grid item md={2} xs={0} />
          <Grid item md={8} xs={12}>
            <Paper className={classes.auth}>
              <div className={classes.authText}>
                <a href="/">
                  <img src={AppIcon} alt="Logo" className={classes.brand} />
                </a>
                <Typography variant="h5" className={classes.authHeader}>
                  Welcome to PhotoSpot
                </Typography>
                <Typography varaint="h6" gutterBottom>
                  Select a type of account to continue
                </Typography>

                <ButtonGroup
                  color="secondary"
                  aria-label="outlined primary button group"
                  fullWidth
                  className={classes.buttonGroup}
                >
                  <Button
                    className={classes.typeButton}
                    variant={this.state.photographer ? "outlined" : "contained"}
                    onClick={() => this.handleToggleChange("customer")}
                  >
                    Customer
                  </Button>
                  <Button
                    className={classes.typeButton}
                    variant={this.state.photographer ? "contained" : "outlined"}
                    onClick={() => this.handleToggleChange("photographer")}
                  >
                    Photographer
                  </Button>
                </ButtonGroup>

                {this.state.photographer ? (
                  <SignUpPhotographer history={this.props.history} />
                ) : (
                  <SignUpUser history={this.props.history} />
                )}
              </div>
            </Paper>

            <Paper className={classes.bottomAuth}>
              <Button
                component={Link}
                to="/login"
                style={{ textTransform: "none" }}
              >
                Have an account?
                <span style={{ color: "#23ba8b" }}>&nbsp;Log in</span>
              </Button>
            </Paper>
          </Grid>
          <Grid item md={2} xs={0}></Grid>
        </Grid>
      </Slide>
    );
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
  authenticated: state.user.authenticated,
});

export default connect(mapStateToProps)(withStyles(styles)(signup));
