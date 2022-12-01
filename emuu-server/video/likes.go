package video

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

//create struct to reflect json values sent from frontend
type DisplayName struct {
	UserName     string `json:"displayName"`
	VideoUrl     string `json:"videoUrl"`
	LikedBoolean bool   `json:"LikedBoolean"`
}

//create struct to reflect firestore value of usersThatLiked array
type Like struct {
	UsersThatLiked []string `firestore:"usersThatLiked"`
}

//set the global variable of username and video url from json input by binding to json
func SetUsernameLike(c *gin.Context) {
	var res DisplayName
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName
	videoUrl = res.VideoUrl

}

//function to check if a user has liked a video
func CheckLikes(c *gin.Context) {

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
	// Firestore initialized
	sa := option.WithCredentialsFile("../serviceAccountKey.json")
	client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
	if err != nil {
		log.Fatalf("firestore client creation error:%s", err)
	}
	defer client.Close()
	//create an array for users that liked of Type Like
	var likesArr Like
	//iterate through Videos collection to find video based off of its url
	iter := client.Collection("Videos").Where("VideoUrl", "==", videoUrl).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		//add the existing stored users that likes array to variable likesArr
		doc.DataTo(&likesArr)
		//Check if user is in the likes array, if they are then set likes to true
		var checkedStatus bool = false
		for i := 0; i < len(likesArr.UsersThatLiked); i++ {
			if likesArr.UsersThatLiked[i] == userUN {
				checkedStatus = true
				break
			}

		}
		//send response back to frontend of whether a user liked the video
		response := struct {
			CheckedValue bool
		}{

			CheckedValue: checkedStatus,
		}

		c.JSON(http.StatusOK, gin.H{"message": response})
	}

}

//function to like a video
func SetLikes(c *gin.Context) {
	//bind json elements sent from frontend to variable input
	var input DisplayName
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
	//if Like is true (checked)
	if input.LikedBoolean == true {
		//create an array to pull existing data and new array to overwrite old array
		var likesArr Like
		var newlikesArr []string
		//Find the video in Firestore
		iter := client.Collection("Videos").Where("VideoUrl", "==", input.VideoUrl).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}
			//Add existing data to likes array
			doc.DataTo(&likesArr)
			//Add new user to new likes array and add existing data to new likes array
			var user = input.UserName
			newlikesArr = append(newlikesArr, user)
			newlikesArr = append(newlikesArr, likesArr.UsersThatLiked...)
			//update the usersThatLiked array in Firestore
			dc := client.Collection("Videos").Doc(doc.Ref.ID)
			_, err = dc.Update(ctx, []firestore.Update{
				{Path: "usersThatLiked", Value: newlikesArr},
			})
			//Update like count in Firestore to be incremented by 1
			li := client.Collection("Videos").Doc(doc.Ref.ID)
			_, err = li.Update(ctx, []firestore.Update{
				{Path: "Likes", Value: firestore.Increment(1)},
			})
		}

	} else { //if Like isn't true (unchecked)
		//create an array to pull existing data and new array to overwrite old array
		var likesArr Like
		var newlikesArr []string
		//Find the video in Firestore
		iter := client.Collection("Videos").Where("VideoUrl", "==", input.VideoUrl).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}
			//Add existing data to likes array
			doc.DataTo(&likesArr)
			//Add existing data to newLikesArr and remove user from the array
			var user = input.UserName
			newlikesArr = append(newlikesArr, likesArr.UsersThatLiked...)
			for i, v := range newlikesArr {
				if v == user {
					newlikesArr = append(newlikesArr[:i], newlikesArr[i+1:]...)
					break
				}
			}
			//Update the usersThatLiked array in Firestore
			dc := client.Collection("Videos").Doc(doc.Ref.ID)
			_, err = dc.Update(ctx, []firestore.Update{
				{Path: "usersThatLiked", Value: newlikesArr},
			})
			//Update the likes count to be decremented by 1
			li := client.Collection("Videos").Doc(doc.Ref.ID)
			_, err = li.Update(ctx, []firestore.Update{
				{Path: "Likes", Value: firestore.Increment(-1)},
			})
		}

	}

}
