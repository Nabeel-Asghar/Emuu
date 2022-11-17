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

var subName string
var creatorName string

type UserAndCreator struct {
	UserName   string `json:"displayName"`
	Creator    string `json:"creatorName"`
	SubBoolean bool   `json:"SubBoolean"`
}

type Subscriber struct {
	UsersThatSubscribed []string `firestore:"SubscriberList"`
}

func SetUserAndCreator(c *gin.Context) {
	var res UserAndCreator
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	subName = res.UserName
	creatorName = res.Creator

}

func CheckSub(c *gin.Context) {

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
	// Firestore initialized
	sa := option.WithCredentialsFile("../serviceAccountKey.json")
	client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
	if err != nil {
		log.Fatalf("firestore client creation error:%s", err)
	}
	defer client.Close()

	var subArr Subscriber
	iter := client.Collection("Users").Where("Username", "==", creatorName).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}

		doc.DataTo(&subArr)
		var checkedStatus bool = false
		for i := 0; i < len(subArr.UsersThatSubscribed); i++ {
			if subArr.UsersThatSubscribed[i] == subName {
				checkedStatus = true
				break
			}

		}

		response := struct {
			CheckedSubValue bool
		}{

			CheckedSubValue: checkedStatus,
		}

		c.JSON(http.StatusOK, gin.H{"message": response})
	}

}

func SetSubscribe(c *gin.Context) {
	var input UserAndCreator
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

	if input.SubBoolean == true {
		var subArr Subscriber
		var newsubArr []string
		iter := client.Collection("Users").Where("Username", "==", input.Creator).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}

			doc.DataTo(&subArr)

			var user = input.UserName

			newsubArr = append(newsubArr, user)
			newsubArr = append(newsubArr, subArr.UsersThatSubscribed...)

			dc := client.Collection("Users").Doc(doc.Ref.ID)
			_, err = dc.Update(ctx, []firestore.Update{
				{Path: "SubscriberList", Value: newsubArr},
			})
			li := client.Collection("Users").Doc(doc.Ref.ID)
			_, err = li.Update(ctx, []firestore.Update{
				{Path: "SubscriberCount", Value: firestore.Increment(1)},
			})
		}

	} else {
		var subArr Subscriber
		var newsubArr []string
		iter := client.Collection("Users").Where("Username", "==", input.Creator).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}

			doc.DataTo(&subArr)

			var user = input.UserName

			newsubArr = append(newsubArr, subArr.UsersThatSubscribed...)
			for i, v := range newsubArr {
				if v == user {
					newsubArr = append(newsubArr[:i], newsubArr[i+1:]...)
					break
				}
			}

			dc := client.Collection("Users").Doc(doc.Ref.ID)
			_, err = dc.Update(ctx, []firestore.Update{
				{Path: "SubscriberList", Value: newsubArr},
			})
			li := client.Collection("Users").Doc(doc.Ref.ID)
			_, err = li.Update(ctx, []firestore.Update{
				{Path: "SubscriberCount", Value: firestore.Increment(-1)},
			})
		}

	}

}
