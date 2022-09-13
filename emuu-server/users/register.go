package users

import (
	"github.com/gin-gonic/gin"
	"fmt"
	"net/http"
)

func RegisterUser(c *gin.Context) {
//authClient, _ := firebaseApp.Auth(context.Background())
    mux := http.NewServeMux()
    mux.HandleFunc("/Register", func(w http.ResponseWriter, r *http.Request)
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

http.ListenAndServe(":8080", mux)

}
