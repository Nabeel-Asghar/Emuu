import React from "react";
import { connectHits } from "react-instantsearch-dom";
import Photographer from "../../components/shared/photographer";

const CustomHits = ({ hits }) =>
  hits.map((hit) => <Photographer photographer={hit} />);

const ConnectedHits = connectHits(CustomHits);

export default ConnectedHits;
