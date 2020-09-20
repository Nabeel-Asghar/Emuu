import React, { useState } from "react";

// Material UI
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";

const CollapseItems = (props) => {
  const [checked, setChecked] = useState(true);

  const handleCheck = () => {
    setChecked(!checked);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <Paper style={{ marginBottom: 15 }}>
        <List dense="true">
          <ListItem>
            <ListItemText
              primary={<Typography variant="body1">{props.text}</Typography>}
              style={{
                textAlign: "center",
              }}
            />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleCheck()}>
                {checked ? (
                  <KeyboardArrowDownIcon />
                ) : (
                  <KeyboardArrowLeftIcon />
                )}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </List>
      </Paper>
      <Collapse in={checked}>{props.items}</Collapse>
    </div>
  );
};

export default CollapseItems;
