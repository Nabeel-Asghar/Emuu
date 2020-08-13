import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

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

class dateView extends Component {
  render() {
    return (
      <div style={{ marginLeft: "10px" }}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <ThemeProvider theme={defaultMaterialTheme}>
            <DatePicker
              disablePast
              autoOk
              orientation="landscape"
              variant="static"
              openTo="date"
              format="MM/dd/yyyy"
              value={this.props.selectedDate}
              onChange={this.props.handleDateChange}
            />
          </ThemeProvider>
        </MuiPickersUtilsProvider>
      </div>
    );
  }
}

export default dateView;
