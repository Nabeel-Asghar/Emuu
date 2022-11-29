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

type DisplayNameDislike struct {
	UserName     string `json:"displayName"`
	VideoUrl     string `json:"videoUrl"`
	DislikedBoolean bool   `json:"DislikedBoolean"`
}

type Dislike struct {
	UsersThatDisliked []string `firestore:"usersThatDisliked"`
}

func SetUsernameDislike(c *gin.Context) {
	var res DisplayName
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName
	videoUrl = res.VideoUrl

}

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

	var dislikesArr Dislike
	iter := client.Collection("Videos").Where("VideoUrl", "==", videoUrl).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}

		doc.DataTo(&dislikesArr)

		var checkedStatus bool = false
		for i := 0; i < len(dislikesArr.UsersThatDisliked); i++ {
			if dislikesArr.UsersThatDisliked[i] == userUN {
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

	if input.DislikedBoolean == true {
		var dislikesArr Like
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

			doc.DataTo(&dislikesArr)
			fmt.Println(dislikesArr.UsersThatDisliked)

			var user = input.UserName
			fmt.Println(user)
			newdislikesArr = append(newdislikesArr, user)
			newdislikesArr = append(newdislikesArr, dislikesArr.UsersThatDisliked...)
			fmt.Println(newdislikesArr)
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

			doc.DataTo(&dislikesArr)
			fmt.Println(dislikesArr.UsersThatDisliked)

			var user = input.UserName
			fmt.Println(user)
			newdislikesArr = append(newdislikesArr, dislikesArr.UsersThatDisliked...)
			for i, v := range newdislikesArr {
				if v == user {
					newdislikesArr = append(newdislikesArr[:i], newdislikesArr[i+1:]...)
					break
				}
			}

			fmt.Println(newdislikesArr)
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
