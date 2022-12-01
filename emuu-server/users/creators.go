package users

import (
	"cloud.google.com/go/firestore"
	"context"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
	"log"
	"net/http"
	"time"
)

// create DisplayName struct to retreive displayName sent from frontend using axios
type DisplayName struct {
	UserName string `json:"displayName"`
}

// create global variable of user's Username
var userUN string

// Create user struct to reflect values needed from Firestore
type User struct {
	Username          string `firestore:"Username"`
	BannerUrl         string `firestore:"BannerUrl"`
	DateJoined        string `firestore:"DateJoined"`
	ProfilePictureUrl string `firestore:"ProfilePictureUrl"`
	SubscriberCount   int    `firestore:"SubscriberCount"`
}

// Sets the username of the creator by binding through the JSON and setting the global variable to the response.username
func SetUsername(c *gin.Context) {
	var res DisplayName
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName

}

// Function to set the creator
func SetUser(c *gin.Context) {
	if userUN != "" {
		//Create a user's data array of type User to send data to frontend
		userDataArr := []User{}
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
		defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
		// Firestore initialized
		sa := option.WithCredentialsFile("../serviceAccountKey.json")
		client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
		if err != nil {
			log.Fatalf("firestore client creation error:%s", err)
		}
		defer client.Close()
		//Iterate through Firestore and find the user in which the username sent from frontend matches the document in Firestore
		iter := client.Collection("Users").Where("Username", "==", userUN).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}
			//Create a variable of userInfo of type User and add document data to the variable
			var userInfo = User{}

			doc.DataTo(&userInfo)
			//Add userInfo data to userData array per iteration
			userDataArr = append(userDataArr, userInfo)

		}
		//Send response back to frontend with the user details
		response := struct {
			UserDetails []User
		}{

			UserDetails: userDataArr,
		}

		c.JSON(http.StatusOK, gin.H{"message": response})

	}
}
