import React, { Component } from "react";

import { DatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

class date extends Component {
  render() {
    const { theDate } = this.props;

    return (
      <div>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DatePicker
            autoOk
            orientation="landscape"
            variant="static"
            openTo="date"
            value={theDate}
            onChange={this.props.parentCallback}
            format="MM/dd/yyyy"
          />
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}

export default date;
