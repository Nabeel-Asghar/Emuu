import React, { useEffect, useState } from "react";
import { connectSearchBox } from "react-instantsearch-dom";

import { makeStyles } from "@material-ui/core/styles";
import { Box, TextField, Button } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  textField: {
    paddingTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  content: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  button: {
    marginTop: 23,
    marginBottom: 10,
    [theme.breakpoints.down("xs")]: {
      marginTop: 5,
    },
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
    <Box className={classes.content}>
      <TextField
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
      </Button>
    </Box>
  );
});

const ConnectedSearchBox = connectSearchBox(CustomSearchBox);

export default ConnectedSearchBox;
