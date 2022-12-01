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

// create struct to reflect json value of video url sent from front end
type VideoView struct {
	VideoUrl string `json:"videoUrl"`
}

// function to update the view of a video
func UpdateView(c *gin.Context) {
	//get video url from json input and bind it to variable res
	var res VideoView
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
	// Firestore initialized
	sa := option.WithCredentialsFile("../serviceAccountKey.json")
	client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
	if err != nil {
		log.Fatalf("firestore client creation error:%s", err)
	}
	defer client.Close()
	//Find video in Firestore based off its url
	iter := client.Collection("Videos").Where("VideoUrl", "==", videoUrl).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		//Update view count to be incremented by 1
		li := client.Collection("Videos").Doc(doc.Ref.ID)
		_, err = li.Update(ctx, []firestore.Update{
			{Path: "Views", Value: firestore.Increment(1)},
		})

	}

}
