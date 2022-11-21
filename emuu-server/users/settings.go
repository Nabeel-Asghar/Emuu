package users

import (
	"context"
	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"

	"log"
	"net/http"

	"time"
)

type PasswordInfo struct {
	NewPassword string `json:"newPassword"`
	Uid         string `json:"uid"`
}

func UpdatePassword(c *gin.Context) {

	var input PasswordInfo
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()

	firebaseAuth := c.MustGet("firebaseAuth").(*auth.Client)

	params := (&auth.UserToUpdate{}).
		Password(input.NewPassword)

	u, err := firebaseAuth.UpdateUser(ctx, input.Uid, params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Successfully updated user: %v\n", u)
	c.JSON(200,gin.H{"message":"Success"})


    return
}
