package video

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

type DisplayName struct {
	UserName     string `json:"displayName"`
	VideoUrl     string `json:"videoUrl"`
	LikedBoolean bool   `json:"LikedBoolean"`
}

type Like struct {
	UsersThatLiked []string `firestore:"usersThatLiked"`
}

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

	fmt.Println(input.LikedBoolean)

	if input.LikedBoolean == true {
		var likesArr Like
		var newlikesArr []string
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
			fmt.Println(likesArr.UsersThatLiked)

			var user = input.UserName
			fmt.Println(user)
			newlikesArr = append(newlikesArr, user)
			newlikesArr = append(newlikesArr, likesArr.UsersThatLiked...)
			fmt.Println(newlikesArr)
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
		var likesArr Like
		var newlikesArr []string
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
			fmt.Println(likesArr.UsersThatLiked)

			var user = input.UserName
			fmt.Println(user)
			newlikesArr = append(newlikesArr, likesArr.UsersThatLiked...)
			for i, v := range newlikesArr {
				if v == user {
					newlikesArr = append(newlikesArr[:i], newlikesArr[i+1:]...)
					break
				}
			}

			fmt.Println(newlikesArr)
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