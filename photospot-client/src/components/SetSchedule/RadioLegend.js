import React, { Component } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

export class radioLegend extends Component {
  render() {
    return (
      <div>
        <FormControlLabel
          checked={true}
          control={<Checkbox />}
          label={"You are available"}
          style={{ width: "120px" }}
        />
        <FormControlLabel
          checked={true}
          disabled={true}
          control={<Checkbox />}
          label={"You are booked"}
          style={{ width: "120px" }}
        />
      </div>
    );
  }
}

export default radioLegend;
