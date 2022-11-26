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
	"reflect"

)

type GamesTag struct {
	GameTag string `json:"gameTag"`
}

var Games string

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
	ProfilePic string

}

func SetGameTag(c *gin.Context) {

	var res GamesTag
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	Games = res.GameTag

}

func SetRecommended(c *gin.Context) {

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
	iter := client.Collection("Videos").Where("GameTag", "==", Games).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		var vid = Vid{}

		doc.DataTo(&vid)
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
		recommendArr = append(recommendArr, vid)
	}

	response := struct {
		RecommendedVideos []Vid
	}{

		RecommendedVideos: recommendArr,
	}

	c.JSON(http.StatusOK, gin.H{"message": response})

}
