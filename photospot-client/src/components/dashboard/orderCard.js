import React, { Component } from "react";
import { Link } from "react-router-dom";

// MUI
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { red } from "@material-ui/core/colors";

// util
import { timeConvert, dateConvert } from "../../util/UtilFunctions";
import { showVault, showCancel } from "../../util/constants";

const styles = (theme) => ({
  ...theme.spreadThis,
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  buttonSpacing: {
    margin: "8px 0px 8px 8px",
  },
});

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(red[500]),
    backgroundColor: red[500],
    "&:hover": {
      backgroundColor: red[700],
    },
  },
}))(Button);

class orderCard extends Component {
  render() {
    const {
      classes,
      photographer: {
        orderID,
        paymentID,
        photographerID,
        firstName,
        lastName,
        profileImage,
        shootDate,
        shootTime,
        amount,
        status,
      },
    } = this.props;

    return (
      <div style={{ marginBottom: 15 }}>
        {photographerID && (
          <Paper>
            <Grid container justify="center" alignItems="center">
              <Grid item md={4} sm={5} xs={12} style={{ textAlign: "center" }}>
                <img
                  src={profileImage}
                  style={{
                    maxWidth: "90%",
                    padding: 10,
                    textAlign: "center",
                    objectFit: "cover",
                  }}
                />
              </Grid>

              <Grid item md={8} sm={7} xs={12}>
                <Grid
                  container
                  direction="column"
                  spacing={1}
                  style={{ padding: 10 }}
                >
                  <Grid item xs={12}>
                    <Paper style={{ padding: 15 }} variant="outlined">
                      <Typography variant="h6" gutterBottom>
                        Photo shoot with {firstName} {lastName}
                      </Typography>
                      <Typography
                        variant="h5"
                        gutterBottom
                        style={{ fontWeight: "bold" }}
                      >
                        {timeConvert(shootTime)} on {dateConvert(shootDate)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper variant="outlined">
                      <List dense="true">
                        <ListItem>
                          <ListItemText
                            primary={
                              <Typography variant="h6">Order Total</Typography>
                            }
                            style={{ textAlign: "left" }}
                          />
                          <ListItemText
                            primary={
                              <Typography variant="h6">${amount}.00</Typography>
                            }
                            style={{ textAlign: "right" }}
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} style={{ textAlign: "right" }}>
                    <>
                      {showVault.includes(status) && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() =>
                            this.props.history.push(`vault/${orderID}`)
                          }
                          className={classes.buttonSpacing}
                        >
                          Photo Vault
                        </Button>
                      )}
                      {showCancel.includes(status) && (
                        <ColorButton
                          variant="contained"
                          color="secondary"
                          onClick={() => this.props.handleRefund(orderID)}
                          className={classes.buttonSpacing}
                        >
                          Cancel
                        </ColorButton>
                      )}
                    </>
                  </Grid>
                  <Grid item xs={12} style={{ textAlign: "right" }}>
                    <Typography>
                      Status: <b>{status}</b>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(orderCard);
