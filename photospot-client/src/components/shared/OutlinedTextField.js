import React from "react";
import CSSTextField from "./CSSTextField";

const OutlinedTextField = (props) => {
  return (
    <CSSTextField
      id={props.name}
      name={props.name}
      type={props.name == "confirmPassword" ? "password" : props.name}
      label={props.label}
      variant="outlined"
      style={{
        margin: "0px auto 15px auto",
        width: "100%",
        textAlign: "left",
      }}
      multiline={props.name == "bio" ? true : false}
      color="secondary"
      helperText={props.errors}
      error={props.errors ? true : false}
      value={props.value}
      onChange={props.handleChange}
      fullWidth
    />
  );
};

export default OutlinedTextField;
