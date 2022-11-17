package users

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

type NameForLiker struct {
	UserName string `json:"displayName"`
}

type LikedVideo struct {
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

type UserLiked struct {
	ProfilePicture string `firestore:"ProfilePictureUrl"`
}

func SetUsernameLiked(c *gin.Context) {
	var res NameForLiker
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName

}

func SetLikedVideos(c *gin.Context) {

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
	// Firestore initialized
	sa := option.WithCredentialsFile("../serviceAccountKey.json")
	client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
	if err != nil {
		log.Fatalf("firestore client creation error:%s", err)
	}
	defer client.Close()

	completeLikedVidsArr := []LikedVideo{}
	iter := client.Collection("Videos").Where("usersThatLiked", "array-contains", userUN).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		var likedVidArr = LikedVideo{}
		doc.DataTo(&likedVidArr)
		iter := client.Collection("Users").Where("Username", "==", likedVidArr.Username).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}
			var profilePic UserLiked
			doc.DataTo(&profilePic)
			reflect.ValueOf(&likedVidArr).Elem().FieldByName("ProfilePic").SetString(profilePic.ProfilePicture)

		}
		completeLikedVidsArr = append(completeLikedVidsArr, likedVidArr)

	}
	response := struct {
		LikedVidDetails []LikedVideo
	}{

		LikedVidDetails: completeLikedVidsArr,
	}
	c.JSON(http.StatusOK, gin.H{"message": response})
}
