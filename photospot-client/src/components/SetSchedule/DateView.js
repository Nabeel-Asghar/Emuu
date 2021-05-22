import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

import { DatePicker } from "@material-ui/pickers";
import { KeyboardDatePicker } from "@material-ui/pickers";
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
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <ThemeProvider theme={defaultMaterialTheme}>
          {this.props.fullScreen ? (
            <KeyboardDatePicker
              disablePast
              openTo="date"
              autoOk
              variant="inline"
              inputVariant="outlined"
              label="With keyboard"
              value={this.props.selectedDate}
              onChange={this.props.handleDateChange}
              style={{ margin: "0 auto" }}
              allowKeyboardControl={false}
            />
          ) : (
            <DatePicker
              disablePast
              autoOk
              variant="static"
              orientation="portrait"
              openTo="date"
              format="MM/dd/yyyy"
              value={this.props.selectedDate}
              onChange={this.props.handleDateChange}
              style={{ margin: "0 auto" }}
            />
          )}
        </ThemeProvider>
      </MuiPickersUtilsProvider>
    );
  }
}

export default dateView;
