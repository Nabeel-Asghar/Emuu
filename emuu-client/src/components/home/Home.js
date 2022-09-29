import React, { useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import './Home.scss';


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
                <h1>EMUU</h1>
                <p class="text-start">
                <h2><div class = "p-4"> Top Videos </div></h2>

                <div className = "spacer">
           <iframe width="382" height="215"
             src="https://www.youtube.com/embed/UqjRknIf3oI"
             title="YouTube video player" frameborder="0"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
            </div>

           <div className = "spacer">
      <iframe width="382" height="215"
        src="https://www.youtube.com/embed/rDxv8jkYmb4"
         title="YouTube video player" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
         allowfullscreen></iframe>
     </div>
    <div className = "spacer">
     <iframe width="382" height="215"
       src="https://www.youtube.com/embed/0GBiA5JOht4"
        title="YouTube video player" frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
       allowfullscreen></iframe>
     </div>
     </p>

     <p class="text-start">
                <div className = "break"><div class = "p-4"><div className = "lineBreak"><h2>Newest</h2></div></div></div>

                <div className = "spacer">
                           <iframe width="382" height="215"
                             src="https://www.youtube.com/embed/RrrleE-EREI"
                             title="YouTube video player" frameborder="0"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowfullscreen></iframe>
                            </div>

                           <div className = "spacer">
                      <iframe width="382" height="215"
                        src="https://www.youtube.com/embed/mybpNuyP9Xw"
                         title="YouTube video player" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                         allowfullscreen></iframe>
                     </div>
                    <div className = "spacer">
                     <iframe width="382" height="215"
                       src="https://www.youtube.com/embed/4XmfNkB8HUY"
                        title="YouTube video player" frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowfullscreen></iframe>
                     </div>
                     </p>

            </div>
        </ThemeProvider>
    );
  useEffect = () => {
    // Get clips
  };
}

export default Home;
