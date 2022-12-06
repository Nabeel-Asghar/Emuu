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

// Create a struct to get the name of the user who wants to see their liked videos
type NameForLiker struct {
	UserName string `json:"displayName"`
}

// Create a struct for liked videos to reflect video document fields in Firestore under the Videos collection
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

// Create a struct to get the profile picture url of the user's video for the liked videos response
type UserLiked struct {
	ProfilePicture string `firestore:"ProfilePictureUrl"`
}

// function to set the username
func SetUsernameLiked(c *gin.Context) {
	var res NameForLiker
	//Bind the json to the variable res of type NameForLiker
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName

}

// Function to set liked videos
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
	//create an array of liked videos of type LikedVideo
	completeLikedVidsArr := []LikedVideo{}
	//Iterate through videos collection to find the videos that the user has liked
	iter := client.Collection("Videos").Where("usersThatLiked", "array-contains", userUN).Documents(ctx)
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		//Add data retrieved from Firestore to the variable likedVidArray of type LikedVideo
		var likedVidArr = LikedVideo{}
		doc.DataTo(&likedVidArr)
		//Iterate through users collection to add the profile picture of the user's video
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
			//Add profile pic to the likedVidArr variable
			reflect.ValueOf(&likedVidArr).Elem().FieldByName("ProfilePic").SetString(profilePic.ProfilePicture)

		}
		//Add each liked video to the array per iteration
		completeLikedVidsArr = append(completeLikedVidsArr, likedVidArr)

	}
	//Send response of liked videos array to frontend
	response := struct {
		LikedVidDetails []LikedVideo
	}{

		LikedVidDetails: completeLikedVidsArr,
	}
	c.JSON(http.StatusOK, gin.H{"message": response})
}
