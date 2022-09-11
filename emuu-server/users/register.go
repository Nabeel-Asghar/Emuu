package users

import (
	"github.com/gin-gonic/gin"
)

func RegisterUser(c *gin.Context) {
	//email := c.PostForm("email")
	//username := c.PostForm("username")
	//password := c.PostForm("password")
	//fName := c.PostForm("firstName")
	//lName := c.PostForm("lastName")
// Add validation to registration
	valid := helpers.Validation(
		[]interfaces.Validation{
			{Value: username, Valid: "username"},
			{Value: email, Valid: "email"},
			{Value: pass, Valid: "password"},
		})
	if valid {
		// Create registration logic
		// Connect DB
		db := helpers.ConnectDB()
		generatedPassword := helpers.HashAndSalt([]byte(pass))
		user := &interfaces.User{Username: username, Email: email, Password: generatedPassword}
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
		return map[string]interface{}{"message": "not valid values"}
	}

}
	c.JSON(200, gin.H{"message": "User has registered successfully!"})
}
