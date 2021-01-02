import MomentUtils from "@date-io/moment";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import React, { useEffect, useState } from "react";
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

const Date = ({ refine, currentRefinement }) => {
  const [selectedDate, handleDateChange] = useState(
    currentRefinement.length !== 0 ? currentRefinement[0] : null
  );

  useEffect(() => {
    if (currentRefinement.length === 0) {
      handleDateChange(null);
    }
  }, [currentRefinement]);

  useEffect(() => {
    if (selectedDate != null && typeof selectedDate === "string") {
      handleDateChange(selectedDate);
      refine(selectedDate);
    } else if (selectedDate != null) {
      handleDateChange(selectedDate);
      refine(selectedDate?.format("MM-DD-YYYY"));
    }
  }, [selectedDate]);

  return (
    <div>
      <Typography variant="h6" style={{ fontWeight: "bold" }} gutterBottom>
        Date
      </Typography>
      <ThemeProvider theme={materialTheme}>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DatePicker
            variant="dialog"
            disablePast={true}
            defaultValue={null}
            format={"MMMM DD, YYYY"}
            value={selectedDate}
            onChange={handleDateChange}
            showTodayButton
            emptyLabel="Pick a date"
          />
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    </div>
  );
};

const ConnectedDate = connectRefinementList(Date);
export default ConnectedDate;
