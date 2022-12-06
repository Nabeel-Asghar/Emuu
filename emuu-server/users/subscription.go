package users

import (
	"cloud.google.com/go/firestore"
	"context"
	"github.com/gin-gonic/gin"
	// 	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
	"log"

	"google.golang.org/api/iterator"
	"net/http"
	// 	"reflect"
	// 	"strconv"
	"time"
)

// create struct to reflect json values sent from frontend
type NameForSubscriptions struct {
	UserName string `json:"displayName"`
}

// create struct to reflect data needed to be sent to frontend for subscriptions
type SubscriptionProfile struct {
	Username          string `firestore:"Username"`
	BannerUrl         string `firestore:"BannerUrl"`
	DateJoined        string `firestore:"DateJoined"`
	ProfilePictureUrl string `firestore:"ProfilePictureUrl"`
	SubscriberCount   int    `firestore:"SubscriberCount"`
}

// set global variable of username by binding to json sent from frontend
func SetUsernameSubscription(c *gin.Context) {
	var res NameForSubscriptions
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName

}

func SetSubscriptions(c *gin.Context) {

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
	// Firestore initialized
	sa := option.WithCredentialsFile("../serviceAccountKey.json")
	client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
	if err != nil {
		log.Fatalf("firestore client creation error:%s", err)
	}
	defer client.Close()
	//create array of subscriptions and iterate through Firestore's Users collection to find users in subscriber lists of other users
	completeSubscriptionArr := []SubscriptionProfile{}
	iter := client.Collection("Users").Where("SubscriberList", "array-contains", userUN).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		//add document data to subscription array
		var subscriptionArr SubscriptionProfile
		doc.DataTo(&subscriptionArr)

		//add subscription array data per iteration to complete subscription array that will be sent to frontend
		completeSubscriptionArr = append(completeSubscriptionArr, subscriptionArr)

	}
	//send response to frontend of subscription list
	response := struct {
		SubscriptionDetails []SubscriptionProfile
	}{

		SubscriptionDetails: completeSubscriptionArr,
	}
	c.JSON(http.StatusOK, gin.H{"message": response})
}
