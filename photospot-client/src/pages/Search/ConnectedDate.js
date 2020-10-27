import React, { useState } from "react";
import MomentUtils from "@date-io/moment";
import lightBlue from "@material-ui/core/colors/lightBlue";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

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

function ConnectedDate() {
  const [selectedDate, handleDateChange] = useState(
    new Date("MMMM DD, h:00 a")
  );

  return (
    <ThemeProvider theme={materialTheme}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <DateTimePicker
          format={"MMMM DD, h:00 a"}
          minutesStep={60}
          value={selectedDate}
          onAccept={console.log(this.state?.selectedDate)}
          onChange={handleDateChange}
        />
      </MuiPickersUtilsProvider>{" "}
    </ThemeProvider>
  );
}

export default ConnectedDate;
