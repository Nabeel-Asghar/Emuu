import React from "react";
import "./button.scss";
import { Box, Button } from "@mui/material";

const ButtonComponent = ({ buttonStyling, color, onClick }) => {
  return (
    <Box sx={buttonStyling}>
      <Button variant="contained" color={color} onClick={onClick}>
        Subscribe
      </Button>
    </Box>
  );
};

export default ButtonComponent;
