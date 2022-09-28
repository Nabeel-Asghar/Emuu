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
                <h1>EMUU</h1>
                <p class="text-start">
                <h2> Top Videos </h2>
<div class="row">
  <div class="col-sm-3"><body>
           <iframe width="382" height="215"
             src="https://www.youtube.com/embed/UqjRknIf3oI"
             title="YouTube video player" frameborder="0"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
            </body>
          </div>
  <div class="col-sm-3"><body>
      <iframe width="382" height="215"
        src="https://www.youtube.com/embed/UqjRknIf3oI"
         title="YouTube video player" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
         allowfullscreen></iframe>
     </body>
     </div>
  <div class="col-sm-3"><body>
     <iframe width="382" height="215"
       src="https://www.youtube.com/embed/UqjRknIf3oI"
        title="YouTube video player" frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
       allowfullscreen></iframe>
     </body>
     </div>
  <div class="col-sm-3"><body>
   <iframe width="382" height="215"
   src="https://www.youtube.com/embed/UqjRknIf3oI"
    title="YouTube video player" frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen></iframe>
   </body>
   </div>
</div>
 </p>
                <p class="text-start">
                <h2>Newest</h2>
                <div class="row">
                  <div class="col-sm-3"><body>
                           <iframe width="382" height="215"
                             src="https://www.youtube.com/embed/mybpNuyP9Xw"
                             title="YouTube video player" frameborder="0"
                           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowfullscreen></iframe>
                            </body>
                          </div>
                  <div class="col-sm-3"><body>
                      <iframe width="382" height="215"
                        src="https://www.youtube.com/embed/mybpNuyP9Xw"
                         title="YouTube video player" frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                         allowfullscreen></iframe>
                     </body>
                     </div>
                  <div class="col-sm-3"><body>
                     <iframe width="382" height="215"
                       src="https://www.youtube.com/embed/mybpNuyP9Xw"
                        title="YouTube video player" frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowfullscreen></iframe>
                     </body>
                     </div>
                  <div class="col-sm-3"><body>
                   <iframe width="382" height="215"
                   src="https://www.youtube.com/embed/mybpNuyP9Xw"
                    title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
                   </body>
                   </div>
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
