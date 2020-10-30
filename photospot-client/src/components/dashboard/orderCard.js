import React, { Component } from "react";
import { Link } from "react-router-dom";

// MUI
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Container from "@material-ui/core/Container";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

// util
import { timeConvert } from "../../util/timeConvert";
import { dateConvert } from "../../util/dateConvert";

const styles = {
  root: { borderColor: "#23ba8b" },
};

class orderCard extends Component {
  render() {
    const {
      classes,
      refundStatus,
      photographer: {
        docID,
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
      <div>
        {photographerID && (
          <Paper>
            <Grid container justify="center" alignItems="center">
              <Grid item xs={4} style={{ textAlign: "center" }}>
                <img
                  src={profileImage}
                  style={{
                    width: "90%",
                    textAlign: "center",
                    objectFit: "cover",
                  }}
                />
              </Grid>

              <Grid item xs={8}>
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
                    {refundStatus ? (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => this.props.handleRefund(paymentID)}
                      >
                        <Typography style={{ fontWeight: "bold" }}>
                          Cancel Order
                        </Typography>
                      </Button>
                    ) : (
                      <Typography>
                        Status: <b>{status}</b>
                      </Typography>
                    )}
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