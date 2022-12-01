package video

import (
	"cloud.google.com/go/firestore"
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
	"log"
	"net/http"
	"time"
)

// create struct to reflect json values sent from frontend for dislikes
type DisplayNameDislike struct {
	UserName        string `json:"displayName"`
	VideoUrl        string `json:"videoUrl"`
	DislikedBoolean bool   `json:"DislikedBoolean"`
}

// create struct to reflect firestore value of dislike array
type Dislike struct {
	UsersThatDisliked []string `firestore:"usersThatDisliked"`
}

// bind to json sent from frontend and set global variables of username and video url
func SetUsernameDislike(c *gin.Context) {
	var res DisplayName
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName
	videoUrl = res.VideoUrl

}

// function to check dislike
func CheckDislikes(c *gin.Context) {

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
	// Firestore initialized
	sa := option.WithCredentialsFile("../serviceAccountKey.json")
	client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
	if err != nil {
		log.Fatalf("firestore client creation error:%s", err)
	}
	defer client.Close()
	//create dislikes array
	var dislikesArr Dislike
	//iterate through Firestore to find video based off of url sent from frontend
	iter := client.Collection("Videos").Where("VideoUrl", "==", videoUrl).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		//add existing document data of dislikes array
		doc.DataTo(&dislikesArr)
		//check if user is disliked, if they are, set dislike button to true
		var checkedStatus bool = false
		for i := 0; i < len(dislikesArr.UsersThatDisliked); i++ {
			if dislikesArr.UsersThatDisliked[i] == userUN {
				checkedStatus = true
				break
			}

		}
		//send response to frontend of the checked value
		response := struct {
			CheckedValue bool
		}{

			CheckedValue: checkedStatus,
		}

		c.JSON(http.StatusOK, gin.H{"message": response})
	}

}
//function to set dislikes
func SetDislikes(c *gin.Context) {
	var input DisplayNameDislike
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
	//if dislikes is true, pull existing likes and dislikes array and create new ones to overwrite
	if input.DislikedBoolean == true {
		var dislikesArr Dislike
		var newdislikesArr []string
		var likesArr Like
		var newlikesArr []string
		//iterate through firestore and find video based off of video url sent from frontend
		iter := client.Collection("Videos").Where("VideoUrl", "==", input.VideoUrl).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}
			//add existing document data to dislikes and likes array
			doc.DataTo(&dislikesArr)
			doc.DataTo(&likesArr)

			var user = input.UserName
			fmt.Println(user)
			//add user to dislikes array and then add existing users back to new dislikes array
			newdislikesArr = append(newdislikesArr, user)
			newdislikesArr = append(newdislikesArr, dislikesArr.UsersThatDisliked...)
			newlikesArr = append(newlikesArr, likesArr.UsersThatLiked...)
			//check if user is in likes array, if they are remove them from array in firestore and decrement value by 1
			for i, v := range newlikesArr {
				if v == user {
					newlikesArr = append(newlikesArr[:i], newlikesArr[i+1:]...)
					ab := client.Collection("Videos").Doc(doc.Ref.ID)
					_, err = ab.Update(ctx, []firestore.Update{
						{Path: "usersThatLiked", Value: newlikesArr},
					})
					cd := client.Collection("Videos").Doc(doc.Ref.ID)
					_, err = cd.Update(ctx, []firestore.Update{
						{Path: "Likes", Value: firestore.Increment(-1)},
					})
					break
				}
			}
			fmt.Println(newdislikesArr)
			//update dislikes array to have new dislikes array and increment value by 1
			dc := client.Collection("Videos").Doc(doc.Ref.ID)
			_, err = dc.Update(ctx, []firestore.Update{
				{Path: "usersThatDisliked", Value: newdislikesArr},
			})
			li := client.Collection("Videos").Doc(doc.Ref.ID)
			_, err = li.Update(ctx, []firestore.Update{
				{Path: "Dislikes", Value: firestore.Increment(1)},
			})

		}

	} else {
		//create dislikes and dislikes arr
		var dislikesArr Dislike
		var newdislikesArr []string
		//iterate through Firestore to find video based off of url and add doc data to dislikes arr
		iter := client.Collection("Videos").Where("VideoUrl", "==", input.VideoUrl).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}

			doc.DataTo(&dislikesArr)
			fmt.Println(dislikesArr.UsersThatDisliked)

			var user = input.UserName
			fmt.Println(user)
			//check if user is in dislikes array, if they are, then remove them
			newdislikesArr = append(newdislikesArr, dislikesArr.UsersThatDisliked...)
			for i, v := range newdislikesArr {
				if v == user {
					newdislikesArr = append(newdislikesArr[:i], newdislikesArr[i+1:]...)
					break
				}
			}

			fmt.Println(newdislikesArr)
			//update users that dislikes array in firestore and increment dislikes by 1
			dc := client.Collection("Videos").Doc(doc.Ref.ID)
			_, err = dc.Update(ctx, []firestore.Update{
				{Path: "usersThatDisliked", Value: newdislikesArr},
			})
			li := client.Collection("Videos").Doc(doc.Ref.ID)
			_, err = li.Update(ctx, []firestore.Update{
				{Path: "Dislikes", Value: firestore.Increment(-1)},
			})
		}

	}

}
