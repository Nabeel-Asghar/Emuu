import moment from "moment";

export function dateConvert(date) {
  let convertedDate = moment(date, "MM/DD/YYYY").format("dddd, MMMM Do");
  return convertedDate;
}
