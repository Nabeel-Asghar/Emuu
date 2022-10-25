import React, { useState } from "react";
import AppContext from "./AppContext";

const AppProvider = (props) => {
  const [isSidebarOpen, setIsSiderbarOpen] = useState(false);


  return (
    <AppContext.Provider
      value={{
        isSidebarOpen,
        toggleSidebarState: () => {
          setIsSiderbarOpen(!isSidebarOpen);
        },
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default AppProvider;
