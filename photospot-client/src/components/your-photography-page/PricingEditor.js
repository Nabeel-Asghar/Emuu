import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import OutlinedTextField from "../shared/OutlinedTextField";
import { Typography } from "@material-ui/core";

const PricingEditor = (props) => {
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Edit Your Pricing</DialogTitle>
      <DialogContent>
        {props.categories?.map((item) => {
          return (
            <>
              <Typography variant="h6">{item}</Typography>

              <OutlinedTextField
                name="price"
                label="Price"
                value={0}
                //handleChange={this.handleChange}
              />
            </>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          Disagree
        </Button>
        <Button onClick={props.handleClose} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PricingEditor;
