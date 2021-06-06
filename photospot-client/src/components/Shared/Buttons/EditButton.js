import React, { Component } from "react";
import { Grid, Button } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

const EditButton = (props) => {
  return (
    <>
      <Grid item xs={12} style={{ textAlign: "right" }}>
        <Button
          color="secondary"
          onClick={props.onClick}
          endIcon={<EditIcon />}
        >
          {props.text}
        </Button>
      </Grid>
    </>
  );
};

export default EditButton;
