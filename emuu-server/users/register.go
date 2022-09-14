package users

import (
	"github.com/gin-gonic/gin"
	"fmt"
	"net/http"
	"encoding/json"
    "io/ioutil"
)

func RegisterUser(c *gin.Context, w http.ResponseWriter, r *http.Request) {
//authClient, _ := firebaseApp.Auth(context.Background())
  /*  mux := http.NewServeMux()
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

    //	_ = ioutil.WriteFile("test.json", file, 0644)

http.ListenAndServe(":8080", mux)
*/


}
