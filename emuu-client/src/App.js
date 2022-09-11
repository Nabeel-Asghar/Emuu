import logo from "./logo.svg";
import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from './components/NavBar/Header'
import {BrowserRouter, Route} from 'react-router-dom'
import Login from './components/UserAuthentication/LoginScreen'
import Register from './components/UserAuthentication/RegisterScreen'
import Home from './components/home/Home'

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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
      <BrowserRouter>
      <Header />
       <h1>Emuu</h1>
       <Route path ="/home">
       <Home />
       </Route>
       <Route path ="/login">
       <Login />
       </Route>
       <Route path ="/register">
        <Register />
       </Route>
       </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
