import {
  FormControl,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import CircularProgress from "@material-ui/core/CircularProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import React, { Component } from "react";
import states from "./states";

const names = ["Linkedin Portrait", "Instagram", "Personal Shoot"];

function getStyles(name, personName, theme) {
  return {
    fontWeight: "fontWeightLight",
  };
}

const ITEM_HEIGHT = 80;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 100,
    },
  },
};

let icon;

const styles = (theme) => ({
  ...theme.spreadThis,
  root: {
    "& > *": {},
  },
  textField: {
    margin: "20px auto",
  },
  textFieldWidth: {
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

export class editPhotographerDetails extends Component {
  handleChange(value) {
    this.setState({ selected: value });
  }

  handleClick() {
    this.setState((state) => ({ hasError: !state.selected }));
  }

  handleDelete = (chipToDelete) => () => {
    this.props.handleCategoryChanges(
      this.props.categories.filter((items) => items !== chipToDelete)
    );
  };

  render() {
    const {
      classes,
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      location_city,
      location_state,
      phoneNumber,
      headline,
      camera,
      instagram,
      company,
      biography,
      categories,
      errors,
    } = this.props;

    return (
      <div style={{ textAlign: "center", padding: "0px 0px 10px 0px" }}>
        <form className={classes.root}>
          <div className={classes.textField}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="Email"
              className={classes.textFieldWidth}
              color="secondary"
              helperText={errors.email}
              error={errors.email ? true : false}
              value={email}
              onChange={this.props.handleChange}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textFieldWidth}
              color="secondary"
              helperText={errors.password}
              error={errors.password ? true : false}
              value={password}
              onChange={this.props.handleChange}
              fullWidth
            />
            <TextField
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              label="Confirm Password"
              className={classes.textFieldWidth}
              color="secondary"
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              value={confirmPassword}
              onChange={this.props.handleChange}
              fullWidth
            />
            <TextField
              className={classes.textFieldWidth}
              id="firstName"
              variant="filled"
              name="firstName"
              label="First Name"
              type="text"
              color="secondary"
              value={firstName}
              onChange={this.props.handleChange}
            />
          </div>

          <div className={classes.textField}>
            <TextField
              className={classes.textFieldWidth}
              id="lastName"
              variant="filled"
              name="lastName"
              label="Last Name"
              type="text"
              color="secondary"
              value={lastName}
              onChange={this.props.handleChange}
            />
          </div>

          <div className={classes.textField}>
            <FormControl
              variant="filled"
              color="secondary"
              className={classes.textFieldWidth}
            >
              <InputLabel id="demo-simple-select-label">State</InputLabel>
              <Select
                name="location_state"
                id="location_state"
                label="State"
                value={location_state}
                onChange={this.props.handleChange}
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
            </FormControl>
          </div>

          <div className={classes.textField}>
            <FormControl
              variant="filled"
              color="secondary"
              className={classes.textFieldWidth}
            >
              <InputLabel id="demo-simple-select-label">City</InputLabel>
              <Select
                id="location_city"
                name="location_city"
                label="City"
                value={location_city}
                onChange={this.props.handleChange}
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
            </FormControl>
          </div>

          <div className={classes.textField}>
            <FormControl
              variant="filled"
              color="secondary"
              className={classes.textFieldWidth}
            >
              <InputLabel id="demo-mutiple-chip-label">Categories</InputLabel>
              <Select
                color="secondary"
                id="categories"
                variant="filled"
                name="categories"
                label="Categories"
                multiple
                value={categories}
                onChange={this.props.handleChange}
                input={<Input id="select-multiple-chip" />}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        color="secondary"
                        key={value}
                        label={value}
                        className={classes.chip}
                        onDelete={this.handleDelete(value)}
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
                {names.map((name) => (
                  <MenuItem key={name} value={name}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className={classes.textField}>
            <TextField
              className={classes.textFieldWidth}
              id="headline"
              variant="filled"
              name="headline"
              label="Headline"
              type="text"
              color="secondary"
              value={headline}
              onChange={this.props.handleChange}
            />
          </div>

          <div className={classes.textField}>
            <TextField
              className={classes.textFieldWidth}
              id="camera"
              variant="filled"
              name="camera"
              label="Camera"
              type="text"
              color="secondary"
              value={camera}
              onChange={this.props.handleChange}
            />
          </div>

          <div className={classes.textField}>
            <TextField
              className={classes.textFieldWidth}
              id="instagram"
              variant="filled"
              name="instagram"
              label="Instagram Handle PHOTO"
              type="text"
              color="secondary"
              value={instagram}
              onChange={this.props.handleChange}
            />
          </div>

          <div className={classes.textField}>
            <TextField
              className={classes.textFieldWidth}
              id="company"
              variant="filled"
              name="company"
              label="Company"
              type="text"
              color="secondary"
              value={company}
              onChange={this.props.handleChange}
            />
          </div>

          <div className={classes.textField}>
            <TextField
              className={classes.textFieldWidth}
              id="biography"
              variant="filled"
              name="biography"
              label="Biography"
              type="text"
              color="secondary"
              multiline
              rows={4}
              value={biography}
              onChange={this.props.handleChange}
            />
          </div>
        </form>
        <Button
          color="secondary"
          variant="contained"
          onClick={this.props.handleAgree}
          disabled={this.props.loading}
        >
          Save Changes
          {this.props.loading && (
            <CircularProgress className={classes.progress} color="secondary" />
          )}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(editPhotographerDetails);
