import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";

const CssTextField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "#23ba8b",
      },
    },
  },
})(TextField);

export default CssTextField;
