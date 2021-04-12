import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withTheme, withStyles } from "@material-ui/core/styles";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Chip from "@material-ui/core/Chip";
import { formatMoney } from "../../util/UtilFunctions";

const styles = (theme) => ({
  number: {
    color: theme.palette.secondary.main,
    fontWeight: "bold",
  },
});

const DashboardPaper = withStyles((theme) => ({
  root: {
    borderRadius: 15,
    borderColor: theme.palette.secondary.main,
    padding: "15px 0px",
  },
}))(Paper);

export class dashboardInfo extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Grid container spacing={2} style={{ marginBottom: 20 }}>
        <Grid item sm={4} xs={6} style={{ textAlign: "center" }}>
          <DashboardPaper variant="outlined">
            <Typography variant="h4" className={classes.number}>
              {this.props.views}
            </Typography>
            <Typography gutterBottom variant="caption">
              Page Views
            </Typography>
            <Typography gutterBottom />
          </DashboardPaper>
        </Grid>
        <Grid item sm={4} xs={6} style={{ textAlign: "center" }}>
          <DashboardPaper variant="outlined">
            <Typography variant="h4" className={classes.number}>
              {this.props.totalOrders}
            </Typography>
            <Typography gutterBottom variant="caption">
              Total Bookings
            </Typography>
            <Typography gutterBottom />
          </DashboardPaper>
        </Grid>
        <Grid item sm={4} xs={12} style={{ textAlign: "center" }}>
          <DashboardPaper variant="outlined">
            <Typography variant="h4" className={classes.number}>
              {formatMoney(this.props.totalRevenue)}
            </Typography>
            <Typography gutterBottom variant="caption">
              Est. Revenue
            </Typography>
            <Typography gutterBottom />
          </DashboardPaper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(withTheme(dashboardInfo));
