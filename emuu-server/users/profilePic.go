package users

import (
	"cloud.google.com/go/firestore"
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/option"
	"log"
	"net/http"
	"time"
)

// Create struct to reflect values of JSON elements sent from axios request on frontend
type ProfileInfo struct {
	UserName string `json:"displayName"`
	Image    string `json:"profileImageUrl"`
}

// function to update profile picture
func UpdateProfile(c *gin.Context) {
	//create variable input and bind JSON to it to retreive username and image url
	var input ProfileInfo
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) //writter with particular error
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
	// Firestore initialized
	sa := option.WithCredentialsFile("../serviceAccountKey.json")
	client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
	if err != nil {
		log.Fatalf("firestore client creation error:%s", err)
	}
	defer client.Close()
	//update profile picture url in Users collection in the user's document
	bannerUpdate, err := client.Collection("Users").Doc(input.UserName).Set(ctx, map[string]interface{}{
		"ProfilePictureUrl": input.Image,
	}, firestore.MergeAll)

	if err != nil {
		// Handle any errors in an appropriate way, such as returning them.
		fmt.Println(bannerUpdate.UpdateTime)
		log.Printf("An error has occurred: %s", err)
	}

}
