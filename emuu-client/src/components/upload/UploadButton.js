import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, {useState} from 'react'
import axios from 'axios';
import database from './firebase';
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

const handleSubmit = async(e) => {
  // store the states in the form data


    await axios.post('http://localhost:8081', JSON.stringify(userdata))
    .then(result=>{setMessage(userdata) ; console.log(userdata);});

}

  //registration form
  return (


    <ThemeProvider theme={theme}>

      <div className="col-sm-6 offset-sm-3">

      <<html lang="en">
         <head>
           <meta charset="UTF-8" />
           <meta name="viewport" content="width=device-width, initial-scale=1.0" />
           <meta http-equiv="X-UA-Compatible" content="ie=edge" />
           <title>Upload File</title>
         </head>
         <body>
           <form
             enctype="multipart/form-data"
             action="http://localhost:8081/upload"
             method="post"
           >
             <input type="file" name="myFile" />
             <input type="submit" value="upload" />
           </form>
         </body>
       </html>


       <button onClick={()=>handleSubmit()} type="submit" className="btn btn-primary">Upload</button>
            </div>

    </ThemeProvider>
  );
}

export default Upload;