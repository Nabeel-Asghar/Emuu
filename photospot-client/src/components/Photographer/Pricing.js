import { Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import React, { useState } from "react";
import { formatMoney } from "../../util/UtilFunctions";
import EditButton from "../Shared/Buttons/EditButton";
import GetIcon from "../Shared/GetIcon";
import { shootType } from "../../util/Constants";

const styles = (theme) => ({
  ...theme.spreadThis,
  selected: {
    border: `5px solid ${theme.palette.secondary.main}`,
    backgroundColor: "lightgray",
  },
});

const Pricing = (props) => {
  const { classes, fullScreen, editable, selectable } = props;
  const [selected, setSelected] = useState(null);

  const pricing = props.pricing && Object.entries(props.pricing);
  const padding = editable ? 10 : 0;

  function handleClick(index) {
    setSelected(index);
    props.handleSelect(pricing[index]);
  }

  return (
    <Paper
      className={classes.paperComponent}
      elevation={3}
      style={{ padding: padding }}
    >
      <Grid container>
        {editable && <EditButton onClick={props.onClick} text="Edit Pricing" />}
        <Grid xs={12}>
          {pricing &&
            pricing.map(function (item, index) {
              return (
                <>
                  <List
                    onClick={() => handleClick(index)}
                    className={
                      selectable && selected === index && classes.selected
                    }
                  >
                    <ListItem>
                      <ListItemIcon style={{ minWidth: 40 }}>
                        <GetIcon name={item[0]} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item[0]}
                        // secondary={!fullScreen && item.description}
                      />

                      <ListItemSecondaryAction className={classes.rightGrid}>
                        <Typography variant="h6">
                          {formatMoney(item[1])}
                        </Typography>
                        <Typography variant="caption"> per hour</Typography>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                  {index < pricing.length - 1 && <Divider />}
                </>
              );
            })}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default withStyles(styles)(Pricing);
