import {
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  withStyles,
} from "@material-ui/core";
import React from "react";
import states from "./States";

const LocationState = (props) => {
  const { classes, errors, location_state } = props;
  return (
    <FormControl
      variant="outlined"
      color="secondary"
      className={classes.textFieldWidth}
    >
      <InputLabel>State</InputLabel>
      <Select
        name="location_state"
        id="location_state"
        label="State"
        error={errors ? true : false}
        value={location_state}
        onChange={props.handleChange}
        MenuProps={{
          getContentAnchorEl: () => null,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
        }}
      >
        {states.map((state) => (
          <MenuItem value={state.stateName} key={state.stateName}>
            {state.stateName}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{errors}</FormHelperText>
    </FormControl>
  );
};

export default LocationState;
