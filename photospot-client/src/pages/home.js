import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";

// Base instance
import API from "../api";

// Photographer
import Photographer from "../components/photographer";

class home extends Component {
  state = {
    allPhotographers: null,
  };

  componentDidMount() {
    API.get("photographers")
      .then((res) => {
        this.setState({
          allPhotographers: res.data,
        });
      })
      .catch((err) => console.log(err.response));
  }

  render() {
    let recentPhotographers = this.state.allPhotographers ? (
      this.state.allPhotographers.map((photographer) => (
        <Photographer
          key={photographer.photographerID}
          photographer={photographer}
        />
      ))
    ) : (
      <p>Loading...</p>
    );

    return (
      <Grid container spacing={10}>
        <Grid item sm={3} xs={12}>
          <p>Search Box</p>
        </Grid>
        <Grid item sm={9} xs={12}>
          {recentPhotographers}
        </Grid>
      </Grid>
    );
  }
}

export default home;
