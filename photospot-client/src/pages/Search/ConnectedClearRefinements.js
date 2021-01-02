import { Button, Typography } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import React from "react";
import Link from "@material-ui/core/Link";
import { connectCurrentRefinements } from "react-instantsearch-dom";
import Chip from "@material-ui/core/Chip";

const ClearRefinements = ({ items, refine, createURL }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
    }}
  >
    {items.map((item) => (
      <>
        {item.items ? (
          <>
            {item.items.map((nested) => (
              <Chip
                label={nested.label}
                onClick={(event) => {
                  event.preventDefault();
                  refine(nested.value);
                }}
                onDelete={(event) => {
                  event.preventDefault();
                  refine(nested.value);
                }}
                style={{ margin: "5px 10px 5px 0px" }}
              />
            ))}
          </>
        ) : (
          <Chip
            label={item.label.replace("avgRating", "Average Rating")}
            onClick={(event) => {
              event.preventDefault();
              refine(item.value);
            }}
            onDelete={(event) => {
              event.preventDefault();
              refine(item.value);
            }}
            style={{ margin: "5px 10px 5px 0px" }}
          />
        )}
      </>
    ))}
    {items.length ? (
      <Button
        onClick={() => refine(items)}
        variant="outlined"
        color="secondary"
        fullWidth
        style={{ margin: "15px 0" }}
      >
        <Typography style={{ fontWeight: "bold" }}>Clear</Typography>
      </Button>
    ) : (
      <Typography variant="subtitle2">Add filters to narrow results.</Typography>
    )}
  </div>
);

const ConnectedClearRefinements = connectCurrentRefinements(ClearRefinements);

export default ConnectedClearRefinements;
