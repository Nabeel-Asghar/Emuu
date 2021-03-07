// Material UI
import Avatar from "@material-ui/core/Avatar";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import withStyles from "@material-ui/core/styles/withStyles";
import React, { useState, useCallback } from "react";
import { Button, Typography } from "@material-ui/core";

// Components
import GetIcon from "../shared/GetIcon";
import { formatMoney } from "../../util/UtilFunctions";
import EditButton from "../shared/Buttons/EditButton";

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

  const pricing = props.pricing?.sort((a, b) => a.price - b.price);
  const padding = editable ? 10 : 0;

  function handleClick(event, index) {
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
            pricing.map((item, index) => {
              return (
                <>
                  <List
                    onClick={(e) => handleClick(e, index)}
                    className={
                      selectable && selected === index && classes.selected
                    }
                  >
                    <ListItem>
                      <ListItemIcon style={{ minWidth: 40 }}>
                        <GetIcon name={item.name} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        secondary={
                          !fullScreen &&
                          "This a shoot where we will try our hardest to accomodate you."
                        }
                      />

                      <ListItemSecondaryAction className={classes.rightGrid}>
                        <Typography variant="h6">
                          {formatMoney(item.price)}
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
