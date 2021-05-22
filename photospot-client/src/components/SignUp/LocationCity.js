import {
  Chip,
  FormControl,
  InputLabel,
  FormHelperText,
  MenuItem,
  Select,
  withStyles,
} from "@material-ui/core";
import React from "react";
import states from "./States";

const LocationState = (props) => {
  const { classes, errors, location_city, location_state } = props;
  return (
    <FormControl
      variant="outlined"
      color="secondary"
      className={classes.textFieldWidth}
    >
      <InputLabel>City</InputLabel>
      <Select
        id="location_city"
        name="location_city"
        label="City"
        error={errors ? true : false}
        value={location_city}
        onChange={props.handleChange}
        disabled={!location_state}
        MenuProps={{
          getContentAnchorEl: () => null,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
        }}
      >
        {location_state
          ? states
              .find(({ stateName }) => stateName === location_state)
              .cities.map((city) => (
                <MenuItem value={city.name} key={city.name}>
                  {city.name}
                </MenuItem>
              ))
          : []}
      </Select>
      <FormHelperText>{errors}</FormHelperText>
    </FormControl>
  );
};

export default LocationState;
