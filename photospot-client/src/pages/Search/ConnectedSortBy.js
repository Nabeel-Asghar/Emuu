import React from "react";
import { connectHits } from "react-instantsearch-dom";
import Photographer from "../../components/shared/photographer";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import { connectSortBy } from "react-instantsearch-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const CustomSortBy = ({ items, refine, createURL }) => {
  const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
  }));

  const BootstrapInput = withStyles((theme) => ({
    root: {
      "label + &": {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      borderRadius: 4,
      position: "relative",
      backgroundColor: theme.palette.background.paper,
      border: "1px solid #ced4da",
      fontSize: 16,
      padding: "5px 26px 5px 12px",
      transition: theme.transitions.create(["border-color", "box-shadow"]),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Roboto",
        '"Helvetica Neue"',
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(","),
      "&:focus": {
        borderRadius: 4,
        borderColor: "#80bdff",
        boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      },
    },
  }))(InputBase);
  const classes = useStyles();
  const [age, setAge] = React.useState("photographers");
  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Select
      labelId="demo-customized-select-label"
      id="demo-customized-select"
      value={age}
      onChange={handleChange}
      input={<BootstrapInput />}
    >
      {console.log(items)}
      {items.map((item) => (
        <MenuItem value={item.value}>
          <a
            href={createURL(item.value)}
            style={{ fontWeight: item.isRefined ? "bold" : "" }}
            onClick={(event) => {
              event.preventDefault();
              refine(item.value);
            }}
          >
            {item.label}
          </a>
        </MenuItem>
      ))}
    </Select>
  );
};
const ConnectedSortBy = connectSortBy(CustomSortBy);

export default ConnectedSortBy;
