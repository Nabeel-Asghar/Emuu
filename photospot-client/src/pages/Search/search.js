import * as algoliasearch from "algoliasearch";
import React, { Component } from "react";
import { InstantSearch, SortBy, RefinementList } from "react-instantsearch-dom";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from "@material-ui/core/Divider";
import { Grid, Paper, Typography } from "@material-ui/core";

// Componenents
import ConnectedClearRefinements from "./ConnectedClearRefinements";
import ConnectedHits from "./ConnectedHits";
import ConnectedNumericMenu from "./ConnectedNumericMenu";
import ConnectedRefinementList from "./ConnectedRefinementList";
import ConnectedSearchBox from "./ConnnectedSearchBox";
import SearchRefinement from "./SearchRefinement";
import ConnectedSortBy from "./ConnectedSortBy";
import ConnectedDate from "./ConnectedDate";
import ConnectedStats from "./ConnectedStats";
import "./search.css";

const styles = (theme) => ({
  ...theme.spreadThis,
  divider: {
    margin: "15px 0px",
  },
});

class Search extends Component {
  render() {
    const { classes } = this.props;
    const APP_ID = "SYUBAMS440";
    const SEARCH_KEY = "587bf2e2211c20cdb452ed974fbd6b77";
    const refinements = [
      { name: "location_city", header: "City" },
      { name: "categories", header: "Category" },
    ];

    var client = algoliasearch(APP_ID, SEARCH_KEY);

    return (
      <Grid container spacing={2}>
        <InstantSearch indexName="photographers" searchClient={client}>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <ConnectedSortBy
              defaultRefinement="photographers"
              items={[
                { value: "photographers", label: "Featured" },
                { value: "rating_desc", label: "Average Rating" },
                { value: "price_desc", label: "Price: High to Low" },
                { value: "price_asc", label: "Price: Low to High" },
              ]}
            />
          </Grid>

          <Grid item xs={3}>
            <Paper style={{ padding: "20px 0px" }}>
              <ConnectedStats />

              {refinements.map((refinement) => (
                <>
                  <SearchRefinement
                    attribute={refinement.name}
                    header={refinement.header}
                  />
                  {/* <Divider className={classes.divider} /> */}
                </>
              ))}

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

              {/* <Divider className={classes.divider} /> */}

              <ConnectedClearRefinements />
            </Paper>
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
