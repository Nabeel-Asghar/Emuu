import * as algoliasearch from "algoliasearch";
import React, { Component } from "react";
import { InstantSearch, SortBy, RefinementList } from "react-instantsearch-dom";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import Divider from "@material-ui/core/Divider";
import { Grid, Paper, Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import qs from "qs";

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
import { Filter1 } from "@material-ui/icons";

const styles = (theme) => ({
  ...theme.spreadThis,
  divider: {
    margin: "15px 0px",
  },
});

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
    openFilter: false,
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

  toggleDialog = () => {
    this.setState((prevState) => ({
      openFilter: !prevState.openFilter,
    }));
  };

  render() {
    const { classes } = this.props;
    const refinements = [
      { name: "location_city", header: "City" },
      { name: "categories", header: "Category" },
    ];

    var client = algoliasearch(APP_ID, SEARCH_KEY);

    return (
      <Grid container spacing={2}>
        <InstantSearch
          indexName="photographers"
          searchClient={client}
          searchState={this.state.searchState}
          onSearchStateChange={this.onSearchStateChange}
          createURL={createURL}
        >
          <ConnectedSearchBox />
          <Grid item xs={12} style={{ textAlign: "right" }}>
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

          <Grid item md={3} sm={12}>
            {this.props.fullScreen ? (
              <>
                <Button onClick={this.toggleDialog} color="secondary">
                  Filter
                </Button>
                <Dialog
                  mountOnEnter
                  unmountOnExit
                  fullScreen={true}
                  open={this.state.openFilter}
                  onClose={this.toggleDialog}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="responsive-dialog-title">
                    <Button onClick={this.toggleDialog} color="secondary">
                      Filter
                    </Button>
                  </DialogTitle>
                  <DialogContent>
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

                    <Divider className={classes.divider} />

                    <ConnectedDate attribute="dates" />
                  </DialogContent>
                </Dialog>
              </>
            ) : (
              <>
                <Paper style={{ padding: "20px 25px", marginBottom: "20px" }}>
                  <ConnectedStats />

                  <ConnectedClearRefinements
                    translation={{ avgRating: "Average Rating" }}
                    style={{ textAlign: "left" }}
                  />
                </Paper>
                <Paper style={{ padding: "20px 25px" }}>
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

                  <Divider className={classes.divider} />

                  <ConnectedDate attribute="dates" />
                </Paper>
              </>
            )}
          </Grid>

          <Grid item md={9} sm={12} xs={12}>
            <Grid spacing={2} container direction="row">
              <ConnectedHits />
            </Grid>
          </Grid>
        </InstantSearch>
      </Grid>
    );
  }
}

export default withStyles(styles)(Search);
