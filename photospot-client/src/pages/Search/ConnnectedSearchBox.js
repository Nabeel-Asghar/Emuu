import React, { useEffect, useState } from "react";
import { connectSearchBox } from "react-instantsearch-dom";

import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  TextField,
  Button,
  Input,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  textField: {
    marginLeft: "15px",
  },

  content: {
    borderRadius: "35px",
    display: "flex",
    marginLeft: "16px",
    marginRight: "16px",
  },
  button: {},
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
    <Box className={classes.content} border={1}>
      <Input
        ref={myRef}
        id="name"
        disableUnderline={true}
        name="name"
        placeholder="Search for what you're like to build..."
        defaultValue={currentRefinement}
        onChange={handleChange}
        className={classes.textField}
        margin="normal"
        size="small"
        fullWidth
      />

      <IconButton
        variant="contained"
        color="secondary"
        className={classes.button}
        onClick={() => handleSubmit(state)}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
});

const ConnectedSearchBox = connectSearchBox(CustomSearchBox);

export default ConnectedSearchBox;
