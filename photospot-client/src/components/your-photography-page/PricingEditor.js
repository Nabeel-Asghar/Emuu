import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import OutlinedTextField from "../shared/OutlinedTextField";
import { Typography } from "@material-ui/core";
import Categories from "../../pages/SignUp/Categories";

const PricingEditor = (props) => {
  const [tempCategories, setCategories] = useState([]);
  const [tempPricingMap, setPricingMap] = useState(new Map());

  useEffect(() => {
    setCategories(Object.values(props.categories));
  }, [props.categories]);

  useEffect(() => {
    setPricingMap(props.pricingMap);
  }, [props.pricingMap]);

  const handleDelete = (chipToDelete) => () => {
    setCategories(tempCategories.filter((items) => items !== chipToDelete));
  };

  const handleClose = () => {
    setCategories(Object.values(props.categories));
    props.handleClose("openPricing");
  };

  const handleAgree = () => {
    console.log(tempCategories, tempPricingMap);
    props.handlePricingAgree(tempCategories, tempPricingMap);
  };

  return (
    <Dialog
      fullWidth="true"
      maxWidth="sm"
      open={props.open}
      onClose={handleClose}
    >
      <DialogTitle>Edit Your Pricing</DialogTitle>

      {console.log(tempCategories)}

      <DialogContent>
        <Categories
          // errors={errors?.categories}
          categories={tempCategories}
          handleChange={(event) => setCategories(event.target.value)}
          handleDelete={handleDelete}
        />
        {tempCategories?.map((item) => {
          return (
            <>
              <Typography variant="h6">{item}</Typography>

              <OutlinedTextField
                name={item}
                label={item}
                value={tempPricingMap?.get(item)}
                handleChange={(event) =>
                  setPricingMap(
                    tempPricingMap.set(event.target.name, event.target.value)
                  )
                }
              />
            </>
          );
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="secondary">
          Disagree
        </Button>
        <Button
          onClick={handleAgree}
          variant="contained"
          color="secondary"
          autoFocus
        >
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PricingEditor;
