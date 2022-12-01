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

// create global variables for subscriber and creator
var subName string
var creatorName string

// create user and creator struct to reflect JSON elements sent from frontend
type UserAndCreator struct {
	UserName   string `json:"displayName"`
	Creator    string `json:"creatorName"`
	SubBoolean bool   `json:"SubBoolean"`
}

// create subscriber struct to reflect firestore value of subscriber list
type Subscriber struct {
	UsersThatSubscribed []string `firestore:"SubscriberList"`
}

// set the user and creator global variables by binding to JSON
func SetUserAndCreator(c *gin.Context) {
	var res UserAndCreator
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	subName = res.UserName
	creatorName = res.Creator

}

// function to check if user is subscribed
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
	//create subscriber array
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
		//iterate through Firestore data to find subscribers array of the creator
		doc.DataTo(&subArr)
		var checkedStatus bool = false
		//check if user is contained within the array, if they are, send true response
		for i := 0; i < len(subArr.UsersThatSubscribed); i++ {
			if subArr.UsersThatSubscribed[i] == subName {
				checkedStatus = true
				break
			}

		}
		//Send the response to frontend of whether user is subscribed
		response := struct {
			CheckedSubValue bool
		}{

			CheckedSubValue: checkedStatus,
		}

		c.JSON(http.StatusOK, gin.H{"message": response})
	}

}

// function to subscribe to user
func SetSubscribe(c *gin.Context) {
	//bind to json and get user and creator
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
	//if user subscribes (true)
	if input.SubBoolean == true {
		//create subscriber array to retrieve current array and new array for updated user
		var subArr Subscriber
		var newsubArr []string
		//iterate through Firestore to find creator document
		iter := client.Collection("Users").Where("Username", "==", input.Creator).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}
			//add document data to subcriber array
			doc.DataTo(&subArr)
			//add user to new subscriber array
			var user = input.UserName

			newsubArr = append(newsubArr, user)
			newsubArr = append(newsubArr, subArr.UsersThatSubscribed...)
			//update the document field to reflect new array that contains user
			dc := client.Collection("Users").Doc(doc.Ref.ID)
			_, err = dc.Update(ctx, []firestore.Update{
				{Path: "SubscriberList", Value: newsubArr},
			})
			//increment subscriber count by 1
			li := client.Collection("Users").Doc(doc.Ref.ID)
			_, err = li.Update(ctx, []firestore.Update{
				{Path: "SubscriberCount", Value: firestore.Increment(1)},
			})
		}

	} else { //if user unsubscribes (false)
		//create subscriber array to retrieve current array and new array for updated user
		var subArr Subscriber
		var newsubArr []string
		//iterate through Firestore to find creator document
		iter := client.Collection("Users").Where("Username", "==", input.Creator).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}
			//add document data to subcriber array

			doc.DataTo(&subArr)

			var user = input.UserName
			//remove user from subscriber array and create new array
			newsubArr = append(newsubArr, subArr.UsersThatSubscribed...)
			for i, v := range newsubArr {
				if v == user {
					newsubArr = append(newsubArr[:i], newsubArr[i+1:]...)
					break
				}
			}
			//update the document field to reflect new array that doesn't contain user
			dc := client.Collection("Users").Doc(doc.Ref.ID)
			_, err = dc.Update(ctx, []firestore.Update{
				{Path: "SubscriberList", Value: newsubArr},
			})
			//decrement subscriber count by 1
			li := client.Collection("Users").Doc(doc.Ref.ID)
			_, err = li.Update(ctx, []firestore.Update{
				{Path: "SubscriberCount", Value: firestore.Increment(-1)},
			})
		}

	}

}
