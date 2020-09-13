import moment from "moment";

export function dateConvert(date) {
  let convertedDate = moment(date).format("dddd, MMMM Do");
  return convertedDate;
}
