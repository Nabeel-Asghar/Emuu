import React, { Component } from "react";
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

class date extends Component {
  render() {
    const { theDate, fullScreen } = this.props;
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    return (
      <center>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <ThemeProvider theme={defaultMaterialTheme}>
            {console.log(fullScreen)}
            {fullScreen ? (
              <KeyboardDatePicker
                minDate={tomorrow}
                autoOk
                variant="dialog"
                inputVariant="outlined"
                label="Pick a date"
                openTo="date"
                value={theDate}
                onChange={this.props.parentCallback}
                format="MM/dd/yyyy"
                allowKeyboardControl={false}
              />
            ) : (
              <DatePicker
                minDate={tomorrow}
                disableToolbar
                autoOk
                variant="static"
                orientation="portrait"
                openTo="date"
                value={theDate}
                onChange={this.props.parentCallback}
                format="MM/dd/yyyy"
              />
            )}
          </ThemeProvider>
        </MuiPickersUtilsProvider>
      </center>
    );
  }
}

export default date;
