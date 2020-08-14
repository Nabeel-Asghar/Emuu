import React, { Component } from "react";

import { DatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#65edbb",
      main: "#23ba8b",
      dark: "#00895e",
      contrastText: "#ffffff",
    },
  },
});

class date extends Component {
  render() {
    const { theDate } = this.props;

    return (
      <div>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <ThemeProvider theme={defaultMaterialTheme}>
            <DatePicker
              disablePast
              autoOk
              orientation="landscape"
              variant="static"
              openTo="date"
              value={theDate}
              onChange={this.props.parentCallback}
              format="MM/dd/yyyy"
            />
          </ThemeProvider>
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}

export default date;
