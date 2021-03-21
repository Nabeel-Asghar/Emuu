import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import React, { useEffect, useState } from "react";
import Categories from "../../pages/SignUp/Categories";
import OutlinedTextField from "../shared/OutlinedTextField";

const PricingEditor = (props) => {
  const [categories, setCategories] = useState([]);
  const [pricingMap, setPricingMap] = useState({});

  useEffect(() => {
    setCategories(Object.values(props.categories));
  }, [props.categories]);

  useEffect(() => {
    setPricingMap(Object.assign(props.pricingMap));
  }, [props.pricingMap]);

  const handleDelete = (chipToDelete) => () => {
    setCategories(categories.filter((items) => items !== chipToDelete));
  };

  const handleClose = () => {
    setPricingMap(Object.assign(props.pricingMap));
    setCategories(Object.values(props.categories));
    props.handleClose("openPricing");
  };

  const handleAgree = () => {
    props.handlePricingAgree(categories, pricingMap);
  };

  const addToPricingObject = (name, price) => {
    setPricingMap({ ...pricingMap, [name]: price });
  };

  return (
    <Dialog
      fullWidth="true"
      maxWidth="sm"
      open={props.open}
      onClose={handleClose}
    >
      <DialogTitle>Edit Your Pricing</DialogTitle>

      <DialogContent>
        <Categories
          // errors={errors?.categories}
          categories={categories}
          handleChange={(event) => setCategories(event.target.value)}
          handleDelete={handleDelete}
        />
        {categories?.map((item) => {
          return (
            <>
              <Typography variant="h6">{item}</Typography>

              <OutlinedTextField
                name={item}
                label={item}
                value={pricingMap[item]}
                handleChange={(event) =>
                  addToPricingObject(event.target.name, event.target.value)
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
