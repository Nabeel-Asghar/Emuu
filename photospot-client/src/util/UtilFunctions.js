import moment from "moment";

export function dateConvert(date) {
  let convertedDate = moment(date, "MM/DD/YYYY").format("dddd, MMMM Do");
  return convertedDate;
}

export function timeConvert(time) {
  // Check correct time format and split into components
  if (time) {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }
}

export function formatMoney(value) {
  return parseFloat(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    style: "currency",
    currency: "USD",
  });
}