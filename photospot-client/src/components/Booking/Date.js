import React, { Component } from "react";
import { DatePicker } from "@material-ui/pickers";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import moment from "moment";
import { Badge } from "@material-ui/core";

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
                renderDay={(
                  day,
                  selectedDate,
                  isInCurrentMonth,
                  dayComponent
                ) => {
                  //const date = makeJSDateObject(day); // skip this step, it is required to support date libs
                  var isSelected = false;
                  if (day > new Date()) {
                    const date = moment(day).format("MM-DD-YYYY");

                    for (const [index, item] of this.props.allDates.entries()) {
                      if (Object.keys(item)[0] === date) {
                        const times = Object.values(item)[0];
                        if (Object.values(times).includes(false)) {
                          isSelected = true;
                        }
                        break;
                      }
                    }
                  }

                  // // You can also use our internal <Day /> component
                  return (
                    <Badge
                      color="primary"
                      variant="dot"
                      invisible={!isSelected ? true : false}
                    >
                      {dayComponent}
                    </Badge>
                  );
                }}
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
                onMonthChange={this.handleMonthChange}
                format="MM/dd/yyyy"
                renderDay={(
                  day,
                  selectedDate,
                  isInCurrentMonth,
                  dayComponent
                ) => {
                  //const date = makeJSDateObject(day); // skip this step, it is required to support date libs
                  var isSelected = false;
                  if (day > new Date()) {
                    const date = moment(day).format("MM-DD-YYYY");

                    for (const [index, item] of this.props.allDates.entries()) {
                      if (Object.keys(item)[0] === date) {
                        const times = Object.values(item)[0];
                        if (Object.values(times).includes(false)) {
                          isSelected = true;
                        }
                        break;
                      }
                    }
                  }

                  // // You can also use our internal <Day /> component
                  return (
                    <Badge
                      color="primary"
                      variant="dot"
                      invisible={!isSelected ? true : false}
                    >
                      {dayComponent}
                    </Badge>
                  );
                }}
              />
            )}
          </ThemeProvider>
        </MuiPickersUtilsProvider>
      </center>
    );
  }
}

export default date;
