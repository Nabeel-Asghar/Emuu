import React, { Component } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Backdrop from "@material-ui/core/Backdrop";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = (theme) => ({
  ...theme.spreadThis,
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
});

export class progress extends Component {
  render() {
    const { classes, open, value } = this.props;
    return (
      <Backdrop className={classes.backdrop} open={open}>
        <div style={{ maxWidth: 250, maxHeight: 250 }}>
          <CircularProgressbar
            value={value}
            text={`${value}%`}
            styles={buildStyles({
              textColor: "#23ba8b",
              pathColor: "#23ba8b",
            })}
          />
        </div>
      </Backdrop>
    );
  }
}

export default withStyles(styles)(progress);
