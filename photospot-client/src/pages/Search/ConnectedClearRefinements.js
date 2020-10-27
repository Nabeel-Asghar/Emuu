import { Button, Typography } from "@material-ui/core";
import React from "react";
import { connectCurrentRefinements } from "react-instantsearch-dom";

const ClearRefinements = ({ items, refine }) => (
  <Button
    onClick={() => refine(items)}
    disabled={!items.length}
    variant="contained"
    color="secondary"
  >
    <Typography style={{ fontWeight: "bold" }}>Clear</Typography>
  </Button>
);

const ConnectedClearRefinements = connectCurrentRefinements(ClearRefinements);

export default ConnectedClearRefinements;
