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

// create a video struct with video document fields for firebase data to retreive all videos
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
    ID                string
	ProfilePic string
}

// create a user struct with user document fields for firebase data to retreive all users
type User struct {
	Username          string `firestore:"Username"`
	BannerUrl         string `firestore:"BannerUrl"`
	DateJoined        string `firestore:"DateJoined"`
	ProfilePictureUrl string `firestore:"ProfilePictureUrl"`
	SubscriberCount   int    `firestore:"SubscriberCount"`
}

// create a user profile picture struct to retrieve profile picture urls from Firestore
type UserPfp struct {
	ProfilePicture string `firestore:"ProfilePictureUrl"`
}

// function to set all videos and users for algolia search functionality
func SetVideosAndUsers(c *gin.Context) {

	//create a video array of type Video
	videoArr := []Video{}
	//create a user array of type User
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
	//set videoCollection to retrieve all documents under Videos collection in Firestore
	videoCollection := client.Collection("Videos").Documents(ctx)
	for {
		doc, err := videoCollection.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		//Create a video variable of type Video to retrieve document data and pass data to variable per iteration
		var vid = Video{}

		doc.DataTo(&vid)
        vid.ID = doc.Ref.ID
		videoCollection := client.Collection("Users").Where("Username", "==", vid.Username).Documents(ctx)
		for {
			doc, err := videoCollection.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}
			var profilePic UserPfp
			doc.DataTo(&profilePic)
			//add profile picture url to each video based off of the user
			reflect.ValueOf(&vid).Elem().FieldByName("ProfilePic").SetString(profilePic.ProfilePicture)

		}
		//add the video to the array per iteration
		videoArr = append(videoArr, vid)

	}
	//set userCollection to retrieve all users under the Users collection in Firestore
	userCollection := client.Collection("Users").Documents(ctx)
	for {
		doc, err := userCollection.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return
		}
		//Create a variable for user of type User and add document data to variable per iteration
		var user = User{}

		doc.DataTo(&user)
		//Add each user to the user array per each iteration
		userArr = append(userArr, user)

	}

	//Create a response for the frontend which can be accessed from there
	response := struct {
		Videos []Video
		Users  []User
	}{

		Videos: videoArr,
		Users:  userArr,
	}

	c.JSON(http.StatusOK, gin.H{"message": response})

}
