import React from "react";
import Slider from "@material-ui/core/Slider";
import { Typography } from "@material-ui/core";

const SliderComponent = (props) => {
  const { label, value, min, max, step, setValue } = props;
  return (
    <div style={{ display: "flex", flex: "1", alignItems: "center" }}>
      <Typography variant="overlined" display="inline">
        {label}
      </Typography>
      <Slider
        color="secondary"
        value={value}
        min={min}
        max={max}
        step={step}
        aria-labelledby={value}
        onChange={(e, value) => setValue(value)}
        style={{
          padding: "22px 0px",
          marginLeft: 16,
          flexDirection: "row",
          alignItems: "center",
          margin: "0 16px",
        }}
      />
    </div>
  );
};

export default SliderComponent;
