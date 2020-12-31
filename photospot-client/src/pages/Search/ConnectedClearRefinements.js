import { Button, Typography } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import React from "react";
import Link from "@material-ui/core/Link";
import { connectCurrentRefinements } from "react-instantsearch-dom";

const ClearRefinements = ({ items, refine, createURL }) => (
  <div>
    {/* {console.log(items)} */}
    <ul
      style={{
        textAlign: "left",
        textDecoration: "underline",
        fontWeight: "bold",
      }}
    >
      {items.map((item) => (
        <li key={item.label}>
          {item.items ? (
            <React.Fragment>
              <ul>
                {item.items.map((nested) => (
                  <li key={nested.label}>
                    <Link
                      color="black"
                      href={createURL(nested.value)}
                      onClick={(event) => {
                        event.preventDefault();
                        refine(nested.value);
                      }}
                    >
                      <ClearIcon fontSize={"medium"} />
                      {nested.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </React.Fragment>
          ) : (
            <Link
              color="black"
              href={createURL(item.value)}
              onClick={(event) => {
                event.preventDefault();
                refine(item.value);
              }}
            >
              <ClearIcon fontSize={"medium"} />
              {item.label.replace("avgRating", "Average Rating")}
            </Link>
          )}
        </li>
      ))}
    </ul>
    {items.length ? (
      <Button
        onClick={() => refine(items)}
        variant="contained"
        color="secondary"
      >
        <Typography style={{ fontWeight: "bold" }}>Clear</Typography>
      </Button>
    ) : null}
  </div>
);

const ConnectedClearRefinements = connectCurrentRefinements(ClearRefinements);

export default ConnectedClearRefinements;
