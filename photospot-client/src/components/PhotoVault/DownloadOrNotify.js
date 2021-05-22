import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import GetAppIcon from "@material-ui/icons/GetApp";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import Fab from "@material-ui/core/Fab";

const styles = (theme) => ({
  ...theme.spreadThis,
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
    marginTop: "25px",
  },
});

export class downloadOrNotify extends Component {
  render() {
    const {
      classes,
      access,
      openProgress,
      notifiedCustomer,
      loading,
      confirmedByCustomer,
      downloadDisable,
    } = this.props;
    return (
      <div>
        {access === "photographer" ? (
          <Fab
            variant="extended"
            color="secondary"
            disabled={openProgress || notifiedCustomer || loading}
            onClick={() => this.props.openFinalizeDialog("photographer")}
          >
            <NotificationsActiveIcon className={classes.extendedIcon} />
            Notify
            {loading && (
              <CircularProgress
                color="secondary"
                className={classes.progress}
              />
            )}
          </Fab>
        ) : (
          confirmedByCustomer && (
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => this.props.downloadImages()}
              disabled={downloadDisable}
              startIcon={<GetAppIcon />}
            >
              Download
              {downloadDisable && (
                <CircularProgress
                  color="secondary"
                  className={classes.progress}
                />
              )}
            </Button>
          )
        )}
      </div>
    );
  }
}

export default withStyles(styles)(downloadOrNotify);
