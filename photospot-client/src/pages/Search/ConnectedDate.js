import MomentUtils from "@date-io/moment";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { DatePicker, KeyboardDatePicker } from "@material-ui/pickers";
import React, { useState } from "react";
import { connectRefinementList } from "react-instantsearch-dom";
const moment = require("moment");

const materialTheme = createMuiTheme({
  palette: {
    primary: {
      light: "#65edbb",
      main: "#23ba8b",
      dark: "#00895e",
      contrastText: "#ffffff",
    },
  },
});

const Date = ({ refine }) => {
  const [selectedDate, handleDateChange] = useState(moment());

  return (
    <ThemeProvider theme={materialTheme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DatePicker
          variant="inline"
          label="Basic example"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </MuiPickersUtilsProvider>{" "}
    </ThemeProvider>
  );
};

const ConnectedDate = connectRefinementList(Date);
export default ConnectedDate;
