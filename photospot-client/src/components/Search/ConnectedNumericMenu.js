import { Typography } from "@material-ui/core";
import React from "react";
import { connectNumericMenu } from "react-instantsearch-dom";
import StarRatings from "react-star-ratings";

const NumericMenu = ({ items, refine, createURL }) => (
  <div>
    <Typography variant="h6" style={{ fontWeight: "bold" }} gutterBottom>
      Average Rating
    </Typography>

    <ul style={{ listStyleType: "none", paddingLeft: "0px", marginTop: "0px" }}>
      {items.map((item) => (
        <li key={item.value} style={{ marginTop: "5px" }}>
          <a
            href={createURL(item.value)}
            onClick={(event) => {
              event.preventDefault();
              refine(item.value);
            }}
            style={{ display: "inline-block" }}
          >
            <StarRatings
              rating={item.label}
              starDimension="20px"
              starRatedColor="#23ba8b"
              starSpacing="1px"
              numberOfStars={5}
              name="rating"
              style={{ verticalAlign: "middle" }}
            />

            <Typography
              variant="body2"
              style={{
                display: "inline-block",
                fontWeight: item.isRefined ? "bold" : "",
                verticalAlign: "middle",
                marginLeft: "6px",
                color: "black",
              }}
            >
              & Up
            </Typography>
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const ConnectedNumericMenu = connectNumericMenu(NumericMenu);

export default ConnectedNumericMenu;
