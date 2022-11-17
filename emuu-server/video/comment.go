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

var videoUrl string

type VideoInfo struct {
	UserName string `json:"postedBy"`
	VideoUrl string `json:"videoUrl"`
	Comment  string `json:"text"`
}
type Comment struct {
	Comments []map[string]string `firestore:"Comments"`
}

func SetComment(c *gin.Context) {
	var input VideoInfo
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) //writter with particular error
		return
	}
	videoUrl = input.VideoUrl
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
	// Firestore initialized
	sa := option.WithCredentialsFile("../serviceAccountKey.json")
	client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
	if err != nil {
		log.Fatalf("firestore client creation error:%s", err)
	}
	defer client.Close()
	commentsArr := Comment{}
	dt := time.Now()
	comment := map[string]string{"postedBy": input.UserName, "text": input.Comment, "date": dt.Format("01-02-2006")}

	iter := client.Collection("Videos").Where("VideoUrl", "==", videoUrl).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}

		doc.DataTo(&commentsArr)

		commentsArr.Comments = append(commentsArr.Comments, comment)

		dc := client.Collection("Videos").Doc(doc.Ref.ID)
		_, err = dc.Update(ctx, []firestore.Update{
			{Path: "Comments", Value: commentsArr.Comments},
		})
	}

}

func GetComment(c *gin.Context) {
	fmt.Println("Hello" + videoUrl)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
	// Firestore initialized
	sa := option.WithCredentialsFile("../serviceAccountKey.json")
	client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
	if err != nil {
		log.Fatalf("firestore client creation error:%s", err)
	}
	defer client.Close()
	commentsArr := Comment{}
	iter := client.Collection("Videos").Where("VideoUrl", "==", videoUrl).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		doc.DataTo(&commentsArr)

	}

	c.JSON(http.StatusOK, gin.H{"message": commentsArr})
}
