import React, { useEffect, useState } from "react";
import { connectSearchBox } from "react-instantsearch-dom";

// Material UI
import { makeStyles } from "@material-ui/core/styles";
import { Paper, TextField, Button } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  searchBox: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    width: 400,
    margin: "0 auto",
  },
  button: {
    marginTop: 23,
    marginBottom: 10,
    [theme.breakpoints.down("xs")]: {
      marginTop: 5,
    },
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
}));

const CustomSearchBox = React.forwardRef((props, myRef) => {
  const classes = useStyles();
  const { currentRefinement, refinementBrand, refine } = props;
  const [state, setState] = useState({
    name: currentRefinement,
  });
  const [showChild, setShowChild] = useState(false);

  // Wait until after client-side hydration shows it.
  useEffect(() => {
    setShowChild(true);
  }, []);

  const handleChange = (evt) => {
    const target = evt.target;

    setState({
      ...state,
      [target.name]: target.type === "checkbox" ? target.checked : target.value,
    });
  };

  const handleSubmit = (objValues) => {
    refine(objValues.name);
  };

  if (!showChild) {
    // You can show some kind of placeholder UI here..
    return <p>Loading {props.attribute}...</p>;
  }

  return (
    <Paper
      component="form"
      onSubmit={() => handleSubmit(state)}
      className={classes.searchBox}
    >
      <InputBase
        id="name"
        name="name"
        label="Feature"
        className={classes.input}
        placeholder="Search"
        defaultValue={currentRefinement}
        onChange={handleChange}
        color="secondary"
      />
      <IconButton
        type="submit"
        className={classes.iconButton}
        color="secondary"
      >
        <SearchIcon />
      </IconButton>
      {/* <TextField
        ref={myRef}
        id="name"
        name="name"
        label="Feature"
        placeholder="Search for what you're like to build..."
        defaultValue={currentRefinement}
        onChange={handleChange}
        className={classes.textField}
        variant="outlined"
        margin="normal"
        size="small"
        fullWidth
        InputLabelProps={{
          shrink: true,
        }}
      />

      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        onClick={() => handleSubmit(state)}
      >
        Search
      </Button> */}
    </Paper>
  );
});

const ConnectedSearchBox = connectSearchBox(CustomSearchBox);

export default ConnectedSearchBox;
