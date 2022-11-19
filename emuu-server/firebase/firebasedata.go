package firebase

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

type Video struct {
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

	ProfilePicUrl string
}

type User struct {
	Username          string `firestore:"Username"`
	BannerUrl         string `firestore:"BannerUrl"`
	DateJoined        string `firestore:"DateJoined"`
	ProfilePictureUrl string `firestore:"ProfilePictureUrl"`
	SubscriberCount   int    `firestore:"SubscriberCount"`
}

func SetVideosAndUsers(c *gin.Context) {

	videoArr := []Video{}
	userArr := []User{}
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
	// Firestore initialized
	sa := option.WithCredentialsFile("../serviceAccountKey.json")
	client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
	if err != nil {
		log.Fatalf("firestore client creation error:%s", err)
	}
	defer client.Close()
	videoCollection := client.Collection("Videos").Documents(ctx)
	for {
		doc, err := videoCollection.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		var vid = Video{}

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
			reflect.ValueOf(&vid).Elem().FieldByName("ProfilePic").SetString(profilePic.ProfilePictureUrl)

		}
		videoArr = append(videoArr, vid)

	}

	userCollection := client.Collection("Users").Documents(ctx)
	for {
		doc, err := userCollection.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		var user = User{}

		doc.DataTo(&user)
		userArr = append(userArr, user)

	}

	response := struct {
		Videos []Video
		Users  []User
	}{

		Videos: videoArr,
		Users:  userArr,
	}

	c.JSON(http.StatusOK, gin.H{"message": response})

}
