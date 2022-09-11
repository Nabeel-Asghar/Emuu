import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    primary: {
      light: "#484848",
      main: "#212121",
      dark: "#000000",
      contrastText: "#fff",
    },
    secondary: {
      light: "#6bffff",
      main: "#0be9d0",
      dark: "#00b69f",
      contrastText: "#000",
    },
  },
});

function Register() {
  return (
    <ThemeProvider theme={theme}>
      <div className="Register">
      <h1>             </h1>
      <h1>Register</h1>
      </div>
    </ThemeProvider>
  );
}

export default Register;