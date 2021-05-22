import { Typography } from "@material-ui/core";
import React from "react";

import { connectStats } from "react-instantsearch-dom";

const CustomStats = ({ processingTimeMS, nbHits }) => (
  <Typography gutterBottom>Found {nbHits} results</Typography>
);

const ConnectedStats = connectStats(CustomStats);

export default ConnectedStats;
