package users

import (
	"cloud.google.com/go/firestore"
	"context"
	"github.com/gin-gonic/gin"
	// 	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
	"log"
	// 	"math"
	"fmt"
	"google.golang.org/api/iterator"
	"net/http"
	// 	"reflect"
	// 	"strconv"
	"time"
)

// create struct to reflect data being sent from frontend
type Name struct {
	UserName string `json:"displayName"`
}

// create struct to reflect Firestore document element of subscriber list
type Subscribed struct {
	UsersThatSubscribed []string `firestore:"SubscriberList"`
}

// create struct to reflect Firestore document fields needed to be sent to frontend
type SubProfile struct {
	Username          string `firestore:"Username"`
	BannerUrl         string `firestore:"BannerUrl"`
	DateJoined        string `firestore:"DateJoined"`
	ProfilePictureUrl string `firestore:"ProfilePictureUrl"`
	SubscriberCount   int    `firestore:"SubscriberCount"`
}

// set global variable of username
func SetUsernameSub(c *gin.Context) {
	var res Name
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName

}

// function to set subscribers
func SetSubscribers(c *gin.Context) {

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
	// Firestore initialized
	sa := option.WithCredentialsFile("../serviceAccountKey.json")
	client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
	if err != nil {
		log.Fatalf("firestore client creation error:%s", err)
	}
	defer client.Close()
	//iterate through users collection to find document of user
	iter := client.Collection("Users").Where("Username", "==", userUN).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		//create subscribers array and add document data retrieved from firestore
		var subscribedArr Subscribed
		doc.DataTo(&subscribedArr)
		//create array of type SubProfile to be sent to frontend
		completeSubscriberArr := []SubProfile{}
		//iterate through each user and get the document data needed to be sent to frontend
		for i := 0; i < len(subscribedArr.UsersThatSubscribed); i++ {

			dsnap, err := client.Collection("Users").Doc(subscribedArr.UsersThatSubscribed[i]).Get(ctx)
			var sub = SubProfile{}
			dsnap.DataTo(&sub)

			completeSubscriberArr = append(completeSubscriberArr, sub)

			if err != nil {
				fmt.Println(err)

			}

		}
		//send response to frontend of subscribers array
		response := struct {
			SubDetails []SubProfile
		}{

			SubDetails: completeSubscriberArr,
		}

		c.JSON(http.StatusOK, gin.H{"message": response})
	}
}
