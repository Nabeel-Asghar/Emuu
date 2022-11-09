import React, { useState } from "react";
import AppContext from "./AppContext";

const AppProvider = (props) => {
  const [isSidebarOpen, setIsSiderbarOpen] = useState(false);

  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebarState: () => {
          setIsSiderbarOpen(!isSidebarOpen);
        },
        isMenuOpen,
        toggleMenuState: () => {
          setIsMenuOpen(!isMenuOpen);
        },
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
