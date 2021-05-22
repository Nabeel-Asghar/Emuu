import React from "react";
import { connectRange } from "react-instantsearch-dom";
import Photographer from "../Shared/PhotographerCard";

const DatePicker = ({ options, isFirstRendering }) => {
  if (!isFirstRendering) return;

  const { refine } = options;

  new Calendar({
    element: $("#calendar"),
    same_day_range: true,
    callback: function () {
      const start = new Date(this.start_date).getTime();
      const end = new Date(this.end_date).getTime();
      const actualEnd = start === end ? end + ONE_DAY_IN_MS - 1 : end;

      refine([start, actualEnd]);
    },
  });
};

const ConnectedDatePicker = connectRange(DatePicker);

export default ConnectedDatePicker;
