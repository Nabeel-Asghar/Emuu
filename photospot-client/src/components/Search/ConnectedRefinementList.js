import { Checkbox, Typography } from "@material-ui/core";
import React from "react";
import { connectRefinementList } from "react-instantsearch-dom";

const RefinementList = ({ items, refine }) => (
  <ul>
    {items.map((item) => (
      <li key={item.label}>
        <a
          href="#"
          style={{
            display: "inline-block",
          }}
          onClick={(event) => {
            event.preventDefault();
            refine(item.value);
          }}
        >
          <Checkbox
            style={{
              padding: 3,
              verticalAlign: "middle",
              transform: "scale(.9)",
            }}
            checked={item.isRefined}
            inputProps={{ "aria-label": "primary checkbox" }}
          />

          <Typography
            variant="body2"
            style={{
              display: "inline-block",
              fontWeight: item.isRefined ? "bold" : "",
              verticalAlign: "middle",
              color: "black",
            }}
          >
            {item.label} ({item.count})
          </Typography>
        </a>
      </li>
    ))}
  </ul>
);

const ConnectedRefinementList = connectRefinementList(RefinementList);

export default ConnectedRefinementList;
