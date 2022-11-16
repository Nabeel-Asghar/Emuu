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

type Name struct {
	UserName string `json:"displayName"`
}

type Subscribed struct {
	UsersThatSubscribed []string `firestore:"SubscriberList"`
}
type SubProfile struct {
	Username          string `firestore:"Username"`
	BannerUrl         string `firestore:"BannerUrl"`
	DateJoined        string `firestore:"DateJoined"`
	ProfilePictureUrl string `firestore:"ProfilePictureUrl"`
	SubscriberCount   int    `firestore:"SubscriberCount"`
}

func SetUsernameSub(c *gin.Context) {
	var res Name
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName

}

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

	iter := client.Collection("Users").Where("Username", "==", userUN).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		var subscribedArr Subscribed
		doc.DataTo(&subscribedArr)

		completeSubscriberArr := []SubProfile{}

		for i := 0; i < len(subscribedArr.UsersThatSubscribed); i++ {

			dsnap, err := client.Collection("Users").Doc(subscribedArr.UsersThatSubscribed[i]).Get(ctx)
			var sub = SubProfile{}
			dsnap.DataTo(&sub)

			completeSubscriberArr = append(completeSubscriberArr, sub)

			if err != nil {
				fmt.Println(err)

			}

		}

		response := struct {
			SubDetails []SubProfile
		}{

			SubDetails: completeSubscriberArr,
		}

		c.JSON(http.StatusOK, gin.H{"message": response})
	}
}
