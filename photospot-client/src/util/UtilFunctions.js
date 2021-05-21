import moment from "moment";

export function dateConvert(date) {
  let convertedDate = moment(date, "MM/DD/YYYY").format("dddd, MMMM Do");
  return convertedDate;
}

export function timeConvert(time, recursive = true) {
  // Check correct time format and split into components
  if (time) {
    time = time.split(":")[0];
    time = parseInt(time);
    let originalTime = time;

    let period = null;

    if (time < 12 || time === 24) {
      period = "AM";
    } else {
      period = "PM";
    }

    if (time > 12) {
      time = time - 12;
    }

    if (recursive) {
      return (
        String(time) +
        ":00 " +
        period +
        " - " +
        timeConvert(String(originalTime + 1) + ":00 ", false)
      );
    } else {
      return String(time) + ":00 " + period;
    }
  }
}

export function formatMoney(value) {
  return parseFloat(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    style: "currency",
    currency: "USD",
  });
}
