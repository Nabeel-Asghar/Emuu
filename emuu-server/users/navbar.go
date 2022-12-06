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

// Create struct to get the json value of username sent from frontend
type NavBarName struct {
	UserName string `json:"displayName"`
}

// Create struct to retreive reflected fields of Firestore needed to be sent to frontend
type NavBarUser struct {
	Username          string `firestore:"Username"`
	BannerUrl         string `firestore:"BannerUrl"`
	DateJoined        string `firestore:"DateJoined"`
	ProfilePictureUrl string `firestore:"ProfilePictureUrl"`
	SubscriberCount   int    `firestore:"SubscriberCount"`
}

// function to set the username based off of the JSON response and bind it to variable res
func SetNavUsername(c *gin.Context) {
	var res DisplayName
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName

}

// function to set the user for the nav bar
func SetNavUser(c *gin.Context) {
	if userUN != "" {
		//create userdata array of type NavBarUser
		userDataArr := []NavBarUser{}
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
		defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
		// Firestore initialized
		sa := option.WithCredentialsFile("../serviceAccountKey.json")
		client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
		if err != nil {
			log.Fatalf("firestore client creation error:%s", err)
		}
		defer client.Close()
		//Iterate through Users collection in Firestore to find user based off of username
		iter := client.Collection("Users").Where("Username", "==", userUN).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}
			//add data to userInfo from document and then add to userData array per iteration
			var userInfo = NavBarUser{}

			doc.DataTo(&userInfo)
			userDataArr = append(userDataArr, userInfo)

		}
		//Send response to frontend containing user details
		response := struct {
			UserDetails []NavBarUser
		}{

			UserDetails: userDataArr,
		}

		c.JSON(http.StatusOK, gin.H{"message": response})

	}
}
