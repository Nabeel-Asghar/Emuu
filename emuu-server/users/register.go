package users

import (
	"github.com/gin-gonic/gin"

)

func RegisterUser(c *gin.Context) {
authClient, _ := firebaseApp.Auth(context.Background())

	email := c.PostForm("email")
	username := c.PostForm("username")
	password := c.PostForm("password")
	fName := c.PostForm("firstName")
	lName := c.PostForm("lastName")
//Validate user registration
	valid := helpers.Validation(
		[]interfaces.Validation{
		    {Value:fName, Valid: "firstName"},
		    {Value:lName, Valid: "lastName"},
		    {Value: email, Valid: "email"},
			{Value: username, Valid: "username"},
			{Value: password, Valid: "password"},
		})
	if valid {
		//Connect firebase
		db := helpers.ConnectDB()
		user := &interfaces.User{Username: username, Email: email, Password: password}
		db.Create(&user)

		account := &interfaces.Account{Type: "Registered Account", Name: string(username + "'s" + " account"), Balance: 0, UserID: user.ID}
		db.Create(&account)

		defer db.Close()
		accounts := []interfaces.ResponseAccount{}
		respAccount := interfaces.ResponseAccount{ID: account.ID, Name: account.Name, Email: account.Email}
		accounts = append(accounts, respAccount)
		var response = prepareResponse(user, accounts)

		return response
	} else {
		return map[string]interface{}{"message": "Invalid"}
	}


	c.JSON(200, gin.H{"message": "User has registered successfully!"})
}
