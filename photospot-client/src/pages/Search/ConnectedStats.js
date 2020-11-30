import React from "react";
import { connectStats } from "react-instantsearch-dom";

const CustomStats = ({ processingTimeMS, nbHits }) => (
  <p style={{ padding: "0px", margin: "0px" }}>Found {nbHits} results</p>
);

const ConnectedStats = connectStats(CustomStats);

export default ConnectedStats;
