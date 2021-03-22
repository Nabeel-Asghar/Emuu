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
import { CATEGORIES_LIST } from "../../util/constants";

const styles = (theme) => ({
  ...theme.spreadThis,
  textFieldWidth: {
    margin: "0px auto 15px auto",
    width: "100%",
    textAlign: "left",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
});

const Categories = (props) => {
  const { classes, errors, categories } = props;
  return (
    <FormControl
      variant="outlined"
      color="secondary"
      className={classes.textFieldWidth}
    >
      <InputLabel>Categories</InputLabel>
      <Select
        id="categories"
        name="categories"
        label="Categories"
        multiple
        error={errors ? true : false}
        value={categories}
        onChange={props.handleChange}
        renderValue={(selected) => (
          <div className={classes.chips}>
            {selected.map((value) => (
              <Chip
                color="secondary"
                key={value}
                label={value}
                className={classes.chip}
                onDelete={props.handleDelete(value)}
                onMouseDown={(event) => {
                  event.stopPropagation();
                }}
              />
            ))}
          </div>
        )}
        MenuProps={{
          getContentAnchorEl: () => null,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
        }}
      >
        {CATEGORIES_LIST.map((name) => (
          <MenuItem key={name} value={name}>
            {name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText style={{ color: "red" }}>{errors}</FormHelperText>
    </FormControl>
  );
};

export default withStyles(styles)(Categories);
