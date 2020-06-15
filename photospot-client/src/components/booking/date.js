import React, { Component } from "react";

import { DatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

class date extends Component {
  render() {
    const { theDate } = this.props;

    return (
      <div>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
