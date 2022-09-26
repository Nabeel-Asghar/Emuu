import React, { useEffect } from "react";
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

function Home() {
    return (
        <ThemeProvider theme={theme}>
            <div className="Home">
                <h1>Emuu</h1>
                <h2>Top Videos </h2>
                <body>
                    <iframe width="560" height="315"
                    src="https://www.youtube.com/embed/UqjRknIf3oI"
                    title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
                  </body>
            </div>
        </ThemeProvider>
    );
  useEffect = () => {
    // Get clips
  };
}

export default Home;
