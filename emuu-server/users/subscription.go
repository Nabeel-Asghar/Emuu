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

type NameForSubscriptions struct {
	UserName string `json:"displayName"`
}

type SubscriptionProfile struct {
	Username          string `firestore:"Username"`
	BannerUrl         string `firestore:"BannerUrl"`
	DateJoined        string `firestore:"DateJoined"`
	ProfilePictureUrl string `firestore:"ProfilePictureUrl"`
	SubscriberCount   int    `firestore:"SubscriberCount"`
}

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
		var subscriptionArr SubscriptionProfile
		doc.DataTo(&subscriptionArr)

		completeSubscriptionArr = append(completeSubscriptionArr, subscriptionArr)

	}
	response := struct {
		SubscriptionDetails []SubscriptionProfile
	}{

		SubscriptionDetails: completeSubscriptionArr,
	}
	c.JSON(http.StatusOK, gin.H{"message": response})
}
