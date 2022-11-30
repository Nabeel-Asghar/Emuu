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

type DisplayName struct {
	UserName     string `json:"displayName"`
	VideoUrl     string `json:"videoUrl"`
	LikedBoolean bool   `json:"LikedBoolean"`
}

type Like struct {
	UsersThatLiked []string `firestore:"usersThatLiked"`
}

func SetUsernameLike(c *gin.Context) {
	var res DisplayName
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName
	videoUrl = res.VideoUrl

}

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

	var likesArr Like
	iter := client.Collection("Videos").Where("VideoUrl", "==", videoUrl).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}

		doc.DataTo(&likesArr)

		var checkedStatus bool = false
		for i := 0; i < len(likesArr.UsersThatLiked); i++ {
			if likesArr.UsersThatLiked[i] == userUN {
				checkedStatus = true
				break
			}

		}

		response := struct {
			CheckedValue bool
		}{

			CheckedValue: checkedStatus,
		}

		c.JSON(http.StatusOK, gin.H{"message": response})
	}

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

	if input.LikedBoolean == true {
		var likesArr Like
		var newlikesArr []string
		var dislikesArr Dislike
		var newdislikesArr []string

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
			doc.DataTo(&dislikesArr)
			fmt.Println(likesArr.UsersThatLiked)

			var user = input.UserName
			fmt.Println(user)
			newlikesArr = append(newlikesArr, user)
			newlikesArr = append(newlikesArr, likesArr.UsersThatLiked...)
			newdislikesArr = append(newdislikesArr, dislikesArr.UsersThatDisliked...)
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
			}

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
