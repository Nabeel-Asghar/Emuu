package users

import (
   //"github.com/gin-gonic/gin"
   "fmt"
   "net/http"
   //"encoding/json"
    //"io/ioutil"
)

func RegisterUser(w http.ResponseWriter, r *http.Request) {
   if r.URL.Path != "/" {
      http.Error(w, "404 not found.", http.StatusNotFound)
      return
   }

   switch r.Method {
   case "GET":
       http.ServeFile(w, r, "C:/Users/Rabby/Documents/Emuu/emuu-client/src/components/UserAuthentication/RegisterScreen.js")
   case "POST":
      // Call ParseForm() to parse the raw query and update r.PostForm and r.Form.
      if err := r.ParseForm(); err != nil {
         fmt.Fprintf(w, "ParseForm() err: %v", err)
         return
      }
      fmt.Fprintf(w, "Post from website! r.PostFrom = %v\n", r.PostForm)
      name := r.FormValue("name")
      address := r.FormValue("address")
      fmt.Fprintf(w, "Name = %s\n", name)
      fmt.Fprintf(w, "Address = %s\n", address)
   default:
      fmt.Fprintf(w, "Sorry, only GET and POST methods are supported.")
   }
}
/*
func RegisterUser(c *gin.Context) {
//authClient, _ := firebaseApp.Auth(context.Background())
    mux := http.NewServeMux()
    mux.HandleFunc("/Register", func(w http.ResponseWriter, r *http.Request))
    {
    //Parse form data from registration page
    r.ParseForm()


    }
    //
   email := c.PostForm("email")
   username := c.PostForm("username")
   password := c.PostForm("password")
   fName := c.PostForm("firstName")
   lName := c.PostForm("lastName")


   //Pass form value data into a json file
   c.JSON(200, gin.H{"message": "User has registered successfully!"})
   c.JSON(200, gin.H{"message": r.FormValue("email")})
   c.JSON(200, gin.H{"message": r.FormValue("username")})
   c.JSON(200, gin.H{"message": r.FormValue("password")})
   c.JSON(200, gin.H{"message": r.FormValue("firstName")})
   c.JSON(200, gin.H{"message": r.FormValue("lastName")})

   //Writes to a json file
   //file, _ := json.MarshalIndent(data, "", " ")

    // _ = ioutil.WriteFile("test.json", file, 0644)

http.ListenAndServe(":8080", mux)

}
*/
