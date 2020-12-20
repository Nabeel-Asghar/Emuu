import React, { Component, useEffect, useState } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Typography } from "@material-ui/core";

const Confirmation = (props) => {
  const [selectedValue, setSelectedValue] = useState(
    !props.secondaryConfirmation
  );

  const handleChange = () => {
    setSelectedValue(!selectedValue);
  };

  return (
    <Dialog
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.text}</DialogContentText>
        {/* Confirmation to cancel order */}
        {props.secondaryConfirmation === true && (
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedValue}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "primary checkbox" }}
                />
              }
              label={<Typography variant="subtitle2">{props.label}</Typography>}
            />
          </FormGroup>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={props.loading}
          onClick={props.handleDisagree}
          variant="outlined"
          color="secondary"
        >
          Disagree
        </Button>
        <Button
          disabled={props.loading || !selectedValue}
          onClick={props.handleAgree}
          variant="contained"
          color="secondary"
          autoFocus
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Confirmation;
