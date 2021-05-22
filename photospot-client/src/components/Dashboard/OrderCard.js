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

// util
import { timeConvert, dateConvert } from "../../util/UtilFunctions";
import { showVault, showCancel } from "../../util/Constants";
import CancelButton from "../Shared/Buttons/CancelButton";

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

class orderCard extends Component {
  getName = () => {
    const { consumer, orderDetails } = this.props;

    const firstName = consumer
      ? orderDetails.photographerFirstName
      : orderDetails.consumerFirstName;
    const lastName = consumer
      ? orderDetails.photographerLastName
      : orderDetails.consumerLastName;

    return `${firstName} ${lastName}`;
  };

  render() {
    const { classes, consumer, orderDetails } = this.props;

    return (
      <div style={{ marginBottom: 15 }}>
        {orderDetails.photographerID && (
          <Paper>
            <Grid container justify="center">
              <Grid
                item
                xs={12}
                style={{
                  textAlign: "right",
                  padding: "2px 10px 0px 0px",
                  marginBottom: "-8px",
                }}
              >
                <Typography variant="overline">
                  ORDER ID: <b>{orderDetails.id}</b>
                </Typography>
              </Grid>
              <Grid item md={4} sm={5} xs={12} style={{ textAlign: "center" }}>
                <img
                  src={
                    consumer
                      ? orderDetails.photographerProfileImage
                      : orderDetails.consumerProfileImage
                  }
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
                        Photo shoot with {this.getName()}
                      </Typography>
                      <Typography
                        variant="h5"
                        gutterBottom
                        style={{ fontWeight: "bold" }}
                      >
                        {timeConvert(orderDetails.shootTime)} on{" "}
                        {dateConvert(orderDetails.shootDate)}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper variant="outlined">
                      <List dense="true">
                        <ListItem>
                          <ListItemText
                            primary={<Typography>Shoot Type</Typography>}
                            style={{ textAlign: "left" }}
                          />
                          <ListItemText
                            primary={
                              <Typography>
                                <b>{orderDetails.shootType}</b>
                              </Typography>
                            }
                            style={{ textAlign: "right" }}
                          />
                        </ListItem>
                      </List>
                    </Paper>
                    <Paper variant="outlined" style={{ marginTop: 8 }}>
                      <List dense="true">
                        <ListItem>
                          <ListItemText
                            primary={<Typography>Order Total</Typography>}
                            style={{ textAlign: "left" }}
                          />
                          <ListItemText
                            primary={
                              <Typography>
                                <b>${orderDetails.amount}.00</b>
                              </Typography>
                            }
                            style={{ textAlign: "right" }}
                          />
                        </ListItem>
                      </List>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} style={{ textAlign: "right" }}>
                    <>
                      {showCancel.includes(orderDetails.status) && (
                        <CancelButton
                          variant="contained"
                          color="secondary"
                          onClick={() =>
                            this.props.handleRefund(orderDetails.orderID)
                          }
                          className={classes.buttonSpacing}
                        >
                          Cancel
                        </CancelButton>
                      )}
                      {showVault.includes(orderDetails.status) && (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() =>
                            this.props.history.push(
                              `vault/${orderDetails.orderID}`
                            )
                          }
                          className={classes.buttonSpacing}
                        >
                          Photo Vault
                        </Button>
                      )}
                    </>
                  </Grid>
                  <Grid item xs={12} style={{ textAlign: "right" }}>
                    <Typography>
                      Status: <b>{orderDetails.status}</b>
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
