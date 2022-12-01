package video

import (
	"cloud.google.com/go/firestore"
	"context"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
	"log"
	"net/http"
	"reflect"
	"time"
)

//Create struct to reflect json values sent from frontend
type GamesTag struct {
	GameTag        string `json:"gameTag"`
	RecommendTitle string `json:"title"`
}

//create two global variables, one for game tag, and one for video title
var Games string
var RecTitle string

//Create struct to reflect video elements needed to be sent to frontend
type Vid struct {
	Username         string              `firestore:"Username"`
	Title            string              `firestore:"VideoTitle"`
	VideoUrl         string              `firestore:"VideoUrl"`
	ThumbnailUrl     string              `firestore:"thumbnailUrl"`
	Likes            int                 `firestore:"Likes"`
	Views            int                 `firestore:"Views"`
	UploadTime       int                 `firestore:"uploadTime"`
	Date             string              `firestore:"Date"`
	GameTag          string              `firestore:"GameTag"`
	VideoDescription string              `firestore:"VideoDescription"`
	UsersThatLiked   []string            `firestore:"usersThatLiked"`
	Comments         []map[string]string `firestore:"Comments,omitempty"`
	ProfilePic       string
}

//set global variables from json input
func SetGameTag(c *gin.Context) {

	var res GamesTag
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	Games = res.GameTag
	RecTitle = res.RecommendTitle

}

//function to set recommended videos
func SetRecommended(c *gin.Context) {
	//create an array of recommended videos of type Vid
	recommendArr := []Vid{}
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
	// Firestore initialized
	sa := option.WithCredentialsFile("../serviceAccountKey.json")
	client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
	if err != nil {
		log.Fatalf("firestore client creation error:%s", err)
	}
	defer client.Close()
	//Find all videos in firestore where game tags are the same as the ones that are sent
	iter := client.Collection("Videos").Where("GameTag", "==", Games).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		//create a video variable and add the document data to vid
		var vid = Vid{}

		doc.DataTo(&vid)
		//If it's the same video, skip iteration
		if vid.Title == RecTitle {
			continue
		}
		//Find the user of each video
		iter := client.Collection("Users").Where("Username", "==", vid.Username).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}
			//Add profile pic of user to video element
			var profilePic User
			doc.DataTo(&profilePic)
			reflect.ValueOf(&vid).Elem().FieldByName("ProfilePic").SetString(profilePic.ProfilePicture)

		}
		//For each iteration, add the video to the recommended array
		recommendArr = append(recommendArr, vid)

	}
	//if recommended videos are less than 10 videos, then add videos of other game tags
	if len(recommendArr) < 10 {
		//Find videos where game tags do not match the one we already have
		iter := client.Collection("Videos").Where("GameTag", "!=", Games).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}
			//Create vid variable and add document data to it
			var vid = Vid{}

			doc.DataTo(&vid)
			//Add profile picture of the user of each video
			iter := client.Collection("Users").Where("Username", "==", vid.Username).Documents(ctx)
			for {
				doc, err := iter.Next()
				if err == iterator.Done {
					break
				}
				if err != nil {
					return
				}
				var profilePic User
				doc.DataTo(&profilePic)
				reflect.ValueOf(&vid).Elem().FieldByName("ProfilePic").SetString(profilePic.ProfilePicture)

			}
			//Add new videos to the recommended array
			recommendArr = append(recommendArr, vid)
			//If the length is greater than 10, then return only 10 videos
			if len(recommendArr) > 10 {
				recommendArr = recommendArr[0:10]
			}
		}
	}
	//send response to frontend of recommended videos
	response := struct {
		RecommendedVideos []Vid
	}{

		RecommendedVideos: recommendArr,
	}

	c.JSON(http.StatusOK, gin.H{"message": response})

}
