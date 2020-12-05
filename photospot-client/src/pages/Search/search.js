import * as algoliasearch from "algoliasearch";
import React, { Component } from "react";
import { InstantSearch, SortBy, RefinementList } from "react-instantsearch-dom";
import qs from "qs";

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
import ConnectedDate from "./ConnectedDate";
import ConnectedSortBy from "./ConnectedSortBy";
import ConnectedStats from "./ConnectedStats";
import "./search.css";

const DEBOUNCE_TIME = 0;
const APP_ID = "SYUBAMS440";
const SEARCH_KEY = "587bf2e2211c20cdb452ed974fbd6b77";
const client = algoliasearch(APP_ID, SEARCH_KEY);

const createURL = (state) => `?${qs.stringify(state)}`;

const searchStateToUrl = (props, searchState) =>
  searchState ? `${props.location.pathname}${createURL(searchState)}` : "";

const urlToSearchState = (location) => qs.parse(location.search.slice(1));

const styles = (theme) => ({
  ...theme.spreadThis,
  divider: {
    margin: "15px 0px",
  },
});

class Search extends Component {
  state = {
    searchState: urlToSearchState(this.props.location),
    lastLocation: this.props.location,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.location !== state.lastLocation) {
      return {
        searchState: urlToSearchState(props.location),
        lastLocation: props.location,
      };
    }

    return null;
  }

  onSearchStateChange = (searchState) => {
    clearTimeout(this.debouncedSetState);

    this.debouncedSetState = setTimeout(() => {
      this.props.history.push(
        searchStateToUrl(this.props, searchState),
        searchState
      );
    }, DEBOUNCE_TIME);

    this.setState({ searchState });
  };

  render() {
    const { classes } = this.props;
    const refinements = [
      { name: "location_city", header: "City" },
      { name: "categories", header: "Category" },
    ];
    return (
      <div>
        <InstantSearch
          indexName="photographers"
          searchClient={client}
          searchState={this.state.searchState}
          onSearchStateChange={this.onSearchStateChange}
          createURL={createURL}
        >
          <ConnectedSearchBox />
          <Grid container spacing={2}>
            <Grid container style={{ backgroundColor: "yellow" }}>
              <Grid item xs={6} style={{ textAlign: "left" }}>
                <ConnectedStats />
              </Grid>
              <Grid item xs={6} style={{ textAlign: "right" }}>
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
            </Grid>

            <Grid item xs={3}>
              <Paper style={{ padding: "20px 0px" }}>
                {refinements.map((refinement) => (
                  <>
                    <SearchRefinement
                      attribute={refinement.name}
                      header={refinement.header}
                    />
                    <Divider className={classes.divider} />
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
                <Typography style={{ fontWeight: "bold" }}>City</Typography>
                <ConnectedRefinementList attribute="location_city" />
                <ConnectedClearRefinements />{" "}
              </Paper>
            </Grid>

            <Grid item xs={9}>
              <Grid spacing={2} container direction="row">
                <ConnectedHits />
              </Grid>
            </Grid>
          </Grid>
        </InstantSearch>
      </div>
    );
  }
}

export default withStyles(styles)(Search);
