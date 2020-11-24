import { Grid, Paper, Typography } from "@material-ui/core";
import * as algoliasearch from "algoliasearch";
import React, { Component } from "react";
import { InstantSearch, SortBy, RefinementList } from "react-instantsearch-dom";
import qs from "qs";

// Componenents
import ConnectedClearRefinements from "./ConnectedClearRefinements";
import ConnectedHits from "./ConnectedHits";
import ConnectedNumericMenu from "./ConnectedNumericMenu";
import ConnectedRefinementList from "./ConnectedRefinementList";
import ConnectedSearchBox from "./ConnnectedSearchBox";
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
    console.log("searchState", this.state.searchState);
    console.log("createURL", createURL(this.state.searchState));
    console.log(
      "serachQuery",
      searchStateToUrl(this.props, this.state.searchState)
    );
    return (
      <Grid container>
        <InstantSearch
          indexName="photographers"
          searchClient={client}
          searchState={this.state.searchState}
          onSearchStateChange={this.onSearchStateChange}
          createURL={createURL}
        >
          <Grid
            item
            xs={6}
            style={{
              textAlign: "center",

              right: 0,
              left: 0,
              marginRight: "auto",
              marginLeft: "auto",
            }}
          >
            <ConnectedSearchBox />
          </Grid>

          <Grid container style={{ backgroundColor: "blue" }}>
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
