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

// create global variable for video url
var videoUrl string

// create struct for comment information sent from frontend
type VideoInfo struct {
	UserName string `json:"postedBy"`
	VideoUrl string `json:"videoUrl"`
	Comment  string `json:"text"`
}

// create comment struct to reflect document field of Comments under the Videos collection
type Comment struct {
	Comments []map[string]string `firestore:"Comments"`
}

//struct to add profile picture into comments
type ProfilePic struct {
	ProfilePicUrl string `firestore:"ProfilePictureUrl"`
}

// function to set comments
func SetComment(c *gin.Context) {
	//bind to json and get the comment info sent from frontend
	var input VideoInfo
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) //written with particular error
		return
	}
	//set video url
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
	var UserPFP ProfilePic

    	pfp := client.Collection("Users").Where("Username", "==", input.UserName).Documents(ctx)
    	for {
    		doc, err := pfp.Next()
    		if err == iterator.Done {
    			break
    		}
    		if err != nil {
    			return
    		}

    		doc.DataTo(&UserPFP)

    	}
	//create comments array
	commentsArr := Comment{}
	//get current time
	dt := time.Now()
	//create comment element based off of information sent from frontend and current date
	comment := map[string]string{"postedBy": input.UserName, "text": input.Comment, "date": dt.Format("01-02-2006"), "ProfilePictureUrl": UserPFP.ProfilePicUrl}
	//iterate through Videos collection to find video that comment was posted on
	iter := client.Collection("Videos").Where("VideoUrl", "==", videoUrl).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		//get data of comments array from Firestore
		doc.DataTo(&commentsArr)
		//add new comment to array
		commentsArr.Comments = append(commentsArr.Comments, comment)
		//update comments to have the new comment in Firestore
		dc := client.Collection("Videos").Doc(doc.Ref.ID)
		_, err = dc.Update(ctx, []firestore.Update{
			{Path: "Comments", Value: commentsArr.Comments},
		})
	}

}

// function to get comments
func GetComment(c *gin.Context) {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
	// Firestore initialized
	sa := option.WithCredentialsFile("../serviceAccountKey.json")
	client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
	if err != nil {
		log.Fatalf("firestore client creation error:%s", err)
	}
	defer client.Close()
	//create comments array
	commentsArr := Comment{}
	//find video in Firestore
	iter := client.Collection("Videos").Where("VideoUrl", "==", videoUrl).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		//get comments array data from Firestore and add to comments array
		doc.DataTo(&commentsArr)

	}
	//send response to frontend
	c.JSON(http.StatusOK, gin.H{"message": commentsArr})
}
