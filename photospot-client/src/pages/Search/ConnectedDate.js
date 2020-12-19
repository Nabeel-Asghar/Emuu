import React, { useState } from "react";
import MomentUtils from "@date-io/moment";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { DatePicker } from "@material-ui/pickers";
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
    <div style={{ padding: "0px 25px" }}>
      <ThemeProvider theme={materialTheme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DatePicker
            format={"MMMM DD, YYYY"}
            value={selectedDate}
            onAccept={() => refine(selectedDate?.format("MM-DD-YYYY"))}
            onChange={handleDateChange}
            showTodayButton
          />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </div>
  );
};

const ConnectedDate = connectRefinementList(Date);
export default ConnectedDate;
