package users

import (
	"github.com/gin-gonic/gin"
)

func RegisterUser(c *gin.Context) {


// 	email := c.PostForm("email")
// 	username := c.PostForm("username")
// 	password := c.PostForm("password")
//fName := c.PostForm("firstName")
//lName := c.PostForm("lastName")

	c.JSON(200, gin.H{"message": "User has registered successfully!"})
}
