import React from "react";
import "./button.scss";
import { Box, Button } from "@mui/material";
//button for subscribe button
const ButtonComponent = ({ buttonStyling, color, onClick }) => {
  return (
    <Box sx={buttonStyling}>
      <Button variant="contained" color={"error"} onClick={onClick}>
        Subscribe
      </Button>
    </Box>
  );
};

export default ButtonComponent;
