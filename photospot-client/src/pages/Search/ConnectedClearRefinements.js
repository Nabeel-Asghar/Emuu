import { Button, Typography } from "@material-ui/core";
import React from "react";
import { connectCurrentRefinements } from "react-instantsearch-dom";

const ClearRefinements = ({ items, refine }) => (
  <div style={{ textAlign: "center" }}>
    <Button
      onClick={() => refine(items)}
      disabled={!items.length}
      variant="contained"
      color="secondary"
    >
      <Typography style={{ fontWeight: "bold" }}>Clear</Typography>
    </Button>
  </div>
);

const ConnectedClearRefinements = connectCurrentRefinements(ClearRefinements);

export default ConnectedClearRefinements;
