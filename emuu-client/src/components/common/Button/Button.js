import React from "react";

import { Box, Button } from "@mui/material";

const ButtonComponent = ({ buttonStyling, color, size, onClick, buttonTitle }) => {
  return (
    <Box sx={buttonStyling}>
      <Button variant="contained" color={color} size={size} onClick={onClick} buttonTitle={buttonTitle}>
        {buttonTitle}
      </Button>
    </Box>
  );
};

export default ButtonComponent;
