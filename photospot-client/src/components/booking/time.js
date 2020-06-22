import React, { Component } from "react";
import equal from "fast-deep-equal";
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
const styles = (theme) => ({
  ...theme.spreadThis,
});

class time extends Component {
  render() {
    const { timeslots } = this.props;

    let items = [];
    let items1 = [];

    if (timeslots && timeslots.length) {
      Object.entries(timeslots[0]).map(([key, value]) => {
        console.log(key, value);
        items.push(<li key={key}>{key}</li>);
        items1.push(<Typography>{value}</Typography>);
      });
    } else {
      items = null;
      items1 = null;
    }

    return <div>{items}</div>;
  }
}

export default withStyles(styles)(time);
