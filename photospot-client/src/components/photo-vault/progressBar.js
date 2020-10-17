import React from "react";

const progressBar = (props) => {
  const containerStyles = {
    height: 20,
    width: "150px",
    backgroundColor: "#e0e0de",
    borderRadius: 50,
    margin: 10,
  };

  const fillerStyles = {
    height: "100%",
    width: `${props.completed}%`,
    backgroundColor: " #23ba8b",
    borderRadius: "inherit",
    textAlign: "right",
    transition: "width 1s ease-in-out",
  };

  const labelStyles = {
    padding: 5,
    color: "white",
    fontWeight: "bold",
  };

  return (
    <div>
      {props.completed}
      <div style={containerStyles}>
        <div style={fillerStyles} />
      </div>
    </div>
  );
};

export default progressBar;
