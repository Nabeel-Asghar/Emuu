package users

import (
	"context"
	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"

	"log"
	"net/http"

	"time"
)

// create password info struct to reflect elements sent from axios request in frontend
type PasswordInfo struct {
	NewPassword string `json:"newPassword"`
	Uid         string `json:"uid"`
}

// function to update password
func UpdatePassword(c *gin.Context) {
	//create variable input and bind JSON elements to retreive new password and uid
	var input PasswordInfo
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()
	//Intialize firebase Auth
	firebaseAuth := c.MustGet("firebaseAuth").(*auth.Client)
	//Update password with new password
	params := (&auth.UserToUpdate{}).
		Password(input.NewPassword)

	u, err := firebaseAuth.UpdateUser(ctx, input.Uid, params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Successfully updated user: %v\n", u)
	c.JSON(200, gin.H{"message": "Success"})

	return
}
