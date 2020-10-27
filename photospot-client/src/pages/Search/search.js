import { Grid, Paper, Typography } from "@material-ui/core";
import * as algoliasearch from "algoliasearch";
import React, { Component } from "react";
import { InstantSearch, SortBy, RefinementList } from "react-instantsearch-dom";

// Componenents
import ConnectedClearRefinements from "./ConnectedClearRefinements";
import ConnectedHits from "./ConnectedHits";
import ConnectedNumericMenu from "./ConnectedNumericMenu";
import ConnectedRefinementList from "./ConnectedRefinementList";
import ConnectedSearchBox from "./ConnnectedSearchBox";
import ConnectedDate from "./ConnectedDate";
import "./search.css";

class Search extends Component {
  render() {
    const APP_ID = "SYUBAMS440";
    const SEARCH_KEY = "587bf2e2211c20cdb452ed974fbd6b77";

    var client = algoliasearch(APP_ID, SEARCH_KEY);

    return (
      <Grid container spacing={2}>
        <InstantSearch indexName="photographers" searchClient={client}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Paper style={{ padding: "10px 0px 15px 0px" }}>
              <ConnectedSearchBox />
              <SortBy
                defaultRefinement="photographers"
                items={[
                  { value: "photographers", label: "Featured" },
                  { value: "rating_desc", label: "Average Rating" },
                  { value: "price_desc", label: "Price: High to Low" },
                  { value: "price_asc", label: "Price: Low to High" },
                ]}
              />
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Typography style={{ fontWeight: "bold" }}>Category</Typography>
            <ConnectedRefinementList attribute="categories" />
            <Typography style={{ fontWeight: "bold" }}>
              Average Rating
            </Typography>
            <ConnectedNumericMenu
              attribute="avgRating"
              items={[
                { label: 4, start: 4 },
                { label: 3, start: 3 },
                { label: 2, start: 2 },
                { label: 1, start: 1 },
              ]}
              transformItems={(items) =>
                items.filter((item) => item.value !== "")
              }
            />
            <Typography style={{ fontWeight: "bold" }}>City</Typography>
            <ConnectedRefinementList attribute="location_city" />

            <Typography style={{ fontWeight: "bold" }}>Date</Typography>
            {/* <ConnectedDate /> */}

            <ConnectedClearRefinements />
          </Grid>

          <Grid item xs={9}>
            <Grid spacing={2} container direction="row">
              <ConnectedHits />
            </Grid>
          </Grid>
        </InstantSearch>
      </Grid>
    );
  }
}

export default Search;
