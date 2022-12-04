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

// create struct to reflect json values sent from frontend for likes
type DisplayName struct {
	UserName     string `json:"displayName"`
	VideoUrl     string `json:"videoUrl"`
	LikedBoolean bool   `json:"LikedBoolean"`
}

// create struct to reflect firestore value of likes array
type Like struct {
	UsersThatLiked []string `firestore:"usersThatLiked"`
}

// bind to json sent from frontend and set global variables of username and video url
func SetUsernameLike(c *gin.Context) {
	var res DisplayName
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName
	videoUrl = res.VideoUrl

}

// function to check like
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
	//create likes array of type Like
	var likesArr Like
	//iterate through Firestore and find video based off of url sent from frontend
	iter := client.Collection("Videos").Where("VideoUrl", "==", videoUrl).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		//add existing document data of likes array
		doc.DataTo(&likesArr)
		//check if user is in likes array, if they are, set like to true
		var checkedStatus bool = false
		for i := 0; i < len(likesArr.UsersThatLiked); i++ {
			if likesArr.UsersThatLiked[i] == userUN {
				checkedStatus = true
				break
			}

		}
		//send response to frontend of checked value for like
		response := struct {
			CheckedValue bool
		}{

			CheckedValue: checkedStatus,
		}

		c.JSON(http.StatusOK, gin.H{"message": response})
	}

}

// function to set likes
func SetLikes(c *gin.Context) {
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
	//if likes is true, pull existing likes and dislikes array and create new ones to overwrite
	if input.LikedBoolean == true {
		var likesArr Like
		var newlikesArr []string
		var dislikesArr Dislike
		var newdislikesArr []string
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
			//add existing document data to likes and dislikes array
			doc.DataTo(&likesArr)
			doc.DataTo(&dislikesArr)

			var user = input.UserName
			//add user to likes array and then add existing users back to new likes array
			newlikesArr = append(newlikesArr, user)
			newlikesArr = append(newlikesArr, likesArr.UsersThatLiked...)
			newdislikesArr = append(newdislikesArr, dislikesArr.UsersThatDisliked...)
			//check if user is in dislikes array, if they are remove them from array in firestore and decrement value by 1
			for i, v := range newdislikesArr {
				if v == user {
					newdislikesArr = append(newdislikesArr[:i], newdislikesArr[i+1:]...)
					ab := client.Collection("Videos").Doc(doc.Ref.ID)
					_, err = ab.Update(ctx, []firestore.Update{
						{Path: "usersThatDisliked", Value: newdislikesArr},
					})
					cd := client.Collection("Videos").Doc(doc.Ref.ID)
					_, err = cd.Update(ctx, []firestore.Update{
						{Path: "Dislikes", Value: firestore.Increment(-1)},
					})
					break
				}
			} //update likes array to have new likes array and increment value by 1
			dc := client.Collection("Videos").Doc(doc.Ref.ID)
			_, err = dc.Update(ctx, []firestore.Update{
				{Path: "usersThatLiked", Value: newlikesArr},
			})
			li := client.Collection("Videos").Doc(doc.Ref.ID)
			_, err = li.Update(ctx, []firestore.Update{
				{Path: "Likes", Value: firestore.Increment(1)},
			})
		}

	} else {
		//create likes and newlikes arr
		var likesArr Like
		var newlikesArr []string
		//iterate through Firestore to find video based off of url and add doc data to likes arr
		iter := client.Collection("Videos").Where("VideoUrl", "==", input.VideoUrl).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}

			doc.DataTo(&likesArr)

			var user = input.UserName
			//check if user is in likes array, if they are, then remove them
			newlikesArr = append(newlikesArr, likesArr.UsersThatLiked...)
			for i, v := range newlikesArr {
				if v == user {
					newlikesArr = append(newlikesArr[:i], newlikesArr[i+1:]...)
					break
				}
			}

			//update users that liked array in firestore and increment likes by 1
			dc := client.Collection("Videos").Doc(doc.Ref.ID)
			_, err = dc.Update(ctx, []firestore.Update{
				{Path: "usersThatLiked", Value: newlikesArr},
			})
			li := client.Collection("Videos").Doc(doc.Ref.ID)
			_, err = li.Update(ctx, []firestore.Update{
				{Path: "Likes", Value: firestore.Increment(-1)},
			})
		}

	}

}
