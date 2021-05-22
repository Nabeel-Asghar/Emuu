import React, { Component } from "react";

// Material UI
import withStyles from "@material-ui/core/styles/withStyles";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

// Components
import RadioLegend from "./RadioLegend";

// util
import equal from "fast-deep-equal";

const styles = (theme) => ({
  ...theme.spreadThis,
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
});

class timeView extends Component {
  componentDidUpdate(prevProps) {
    if (!equal(this.props.checked, prevProps.checked)) {
      this.forceUpdate();
    }
  }

  render() {
    const { classes, checked, disabled, open, error } = this.props;

    // open={this.state.open}
    //           error={generalError}
    //           handleClose={this.handleClose}

    return (
      <form onSubmit={this.props.handleSubmit} style={{ width: "100%" }}>
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={open}
          autoHideDuration={4000}
          onClose={this.props.handleClose}
        >
          <Alert
            onClose={this.props.handleClose}
            severity={error ? "warning" : "success"}
          >
            {error ? "Something went wrong" : "Success!"}
          </Alert>
        </Snackbar>
        <FormControl
          component="fieldset"
          style={{ margin: "0 auto", width: "100%" }}
          color="secondary"
        >
          <FormLabel
            component="legend"
            style={{
              textAlign: "center",
              color: "black",
              padding: "15px 0 15px 0",
            }}
          >
            Choose timeslots that you are available at
          </FormLabel>
          <FormGroup>
            <Grid container>
              <Grid item xs={6}>
                <FormControlLabel
                  disabled={disabled.includes(9) ? true : false}
                  control={
                    <Checkbox
                      checked={checked.includes(9) ? true : false}
                      onChange={this.props.handleChange}
                      name={"09:00"}
                      color="secondary"
                      value={9}
                    />
                  }
                  label={"9:00 AM"}
                  key={9}
                  className={classes.timeslots}
                />

                <FormControlLabel
                  disabled={disabled.includes(10) ? true : false}
                  control={
                    <Checkbox
                      checked={checked.includes(10) ? true : false}
                      onChange={this.props.handleChange}
                      name={"10:00"}
                      color="secondary"
                      value={10}
                    />
                  }
                  label={"10:00 AM"}
                  key={10}
                  className={classes.timeslots}
                />

                <FormControlLabel
                  disabled={disabled.includes(11) ? true : false}
                  control={
                    <Checkbox
                      checked={checked.includes(11) ? true : false}
                      onChange={this.props.handleChange}
                      name={"11:00"}
                      color="secondary"
                      value={11}
                    />
                  }
                  label={"11:00 AM"}
                  key={11}
                  className={classes.timeslots}
                />

                <FormControlLabel
                  disabled={disabled.includes(12) ? true : false}
                  control={
                    <Checkbox
                      checked={checked.includes(12) ? true : false}
                      onChange={this.props.handleChange}
                      name={"12:00"}
                      color="secondary"
                      value={12}
                    />
                  }
                  label={"12:00 PM"}
                  key={12}
                  className={classes.timeslots}
                />

                <FormControlLabel
                  disabled={disabled.includes(13) ? true : false}
                  control={
                    <Checkbox
                      checked={checked.includes(13) ? true : false}
                      onChange={this.props.handleChange}
                      name={"13:00"}
                      color="secondary"
                      value={13}
                    />
                  }
                  label={"1:00 PM"}
                  key={13}
                  className={classes.timeslots}
                />
                <FormControlLabel
                  disabled={disabled.includes(14) ? true : false}
                  control={
                    <Checkbox
                      checked={checked.includes(14) ? true : false}
                      onChange={this.props.handleChange}
                      name={"14:00"}
                      color="secondary"
                      value={14}
                    />
                  }
                  label={"2:00 PM"}
                  key={14}
                  className={classes.timeslots}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControlLabel
                  disabled={disabled.includes(15) ? true : false}
                  control={
                    <Checkbox
                      checked={checked.includes(15) ? true : false}
                      onChange={this.props.handleChange}
                      name={"15:00"}
                      color="secondary"
                      value={15}
                    />
                  }
                  label={"3:00 PM"}
                  key={15}
                  className={classes.timeslots}
                />
                <FormControlLabel
                  disabled={disabled.includes(16) ? true : false}
                  control={
                    <Checkbox
                      checked={checked.includes(16) ? true : false}
                      onChange={this.props.handleChange}
                      name={"16:00"}
                      color="secondary"
                      value={16}
                    />
                  }
                  label={"4:00 PM"}
                  key={16}
                  className={classes.timeslots}
                />

                <FormControlLabel
                  disabled={disabled.includes(17) ? true : false}
                  control={
                    <Checkbox
                      checked={checked.includes(17) ? true : false}
                      onChange={this.props.handleChange}
                      name={"17:00"}
                      color="secondary"
                      value={17}
                    />
                  }
                  label={"5:00 PM"}
                  key={17}
                  className={classes.timeslots}
                />
                <FormControlLabel
                  disabled={disabled.includes(18) ? true : false}
                  control={
                    <Checkbox
                      checked={checked.includes(18) ? true : false}
                      onChange={this.props.handleChange}
                      name={"18:00"}
                      color="secondary"
                      value={18}
                    />
                  }
                  label={"6:00 PM"}
                  key={18}
                  className={classes.timeslots}
                />
                <FormControlLabel
                  disabled={disabled.includes(19) ? true : false}
                  control={
                    <Checkbox
                      checked={checked.includes(19) ? true : false}
                      onChange={this.props.handleChange}
                      name={"19:00"}
                      color="secondary"
                      value={19}
                    />
                  }
                  label={"7:00 PM"}
                  key={19}
                  className={classes.timeslots}
                />

                <FormControlLabel
                  disabled={disabled.includes(20) ? true : false}
                  control={
                    <Checkbox
                      checked={checked.includes(20) ? true : false}
                      onChange={this.props.handleChange}
                      name={"20:00"}
                      color="secondary"
                      value={20}
                    />
                  }
                  label={"8:00 PM"}
                  key={20}
                  className={classes.timeslots}
                />
              </Grid>

              <Grid
                item
                xs={12}
                style={{ marginTop: "20px", textAlign: "center" }}
              >
                <RadioLegend />
              </Grid>
            </Grid>
          </FormGroup>
        </FormControl>
      </form>
    );
  }
}

export default withStyles(styles)(timeView);
