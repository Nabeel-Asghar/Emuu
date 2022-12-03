package video

import (
	"cloud.google.com/go/firestore"
    "context"
    "github.com/gin-gonic/gin"
    "google.golang.org/api/iterator"
    "google.golang.org/api/option"
    "log"
    "math"
    "fmt"
    "net/http"
    "reflect"
    "strconv"
    "time"
)

//create struct to reflect json values sent from frontend (name and page number)
type DisplayNameAndPage struct {
	UserName   string `json:"displayName"`
	PageNumber string `json:"pageNumber"`
}

//create three global variables, username and page number, and ID for video
var userUN string
var PageNum int

//create a struct of type Video which reflect document fields in Firestore's Videos collection
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
    Dislikes            int                 `firestore:"Dislikes"`
    UsersThatDisliked   []string            `firestore:"usersThatDisliked"`
    ProfilePic string
    ID                  string
}

//Create struct to retrieve firestore's profile pic of each user
type User struct {
	ProfilePicture string `firestore:"ProfilePictureUrl"`
}

//Bubble sort function to sort most viewed videos, sorts in descending order according to views
func sortMostViewed(videos []Video) []Video {

	for i := 0; i < len(videos)-1; i++ {
		for j := 0; j < len(videos)-i-1; j++ {
			if videos[j].Views < videos[j+1].Views {
				videos[j], videos[j+1] = videos[j+1], videos[j]
			}
		}
	}
	return videos
}

//Bubble sort function to sort recently uploaded videos, sorts in descending order according to upload time
func sortRecent(videos []Video) []Video {

	for i := 0; i < len(videos)-1; i++ {
		for j := 0; j < len(videos)-i-1; j++ {
			if videos[j].UploadTime < videos[j+1].UploadTime {
				videos[j], videos[j+1] = videos[j+1], videos[j]
			}
		}
	}
	return videos
}

//set the username and page based off of json input by binding to it
func SetUsernameAndPage(c *gin.Context) {
	var res DisplayNameAndPage
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName
	//convert page number from string to integer
	PageNum, _ = strconv.Atoi(res.PageNumber)

}

//universal function to set videos on home page, creators page, and profile page
func SetVideos(c *gin.Context) {
	if userUN != "" { //if there is a username
		//create an array for most viewed and recently uploaded
		mostViewedArr := []Video{}
		recentArr := []Video{}
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
		defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
		// Firestore initialized
		sa := option.WithCredentialsFile("../serviceAccountKey.json")
		client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
		if err != nil {
			log.Fatalf("firestore client creation error:%s", err)
		}
		defer client.Close()
		//Find all videos of that user in Firestore
		iter := client.Collection("Videos").Where("Username", "==", userUN).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}
			//add each video document data to variable vid of type Video
			var vid = Video{}

			doc.DataTo(&vid)
			vid.ID = doc.Ref.ID
			//add profile picture of user of each video to the vid variable
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
			//add each video to both arrays of most viewed and recently uploaded
			mostViewedArr = append(mostViewedArr, vid)
			recentArr = append(recentArr, vid)
		}
		//sort both arrays according to their parameter
		sortMostViewed(mostViewedArr)
		sortRecent(recentArr)
		//create page amount variable to set the number of pages that exist (8 videos per page; 15 videos = 2 pages)
		var pageAmount int
		pageAmount = int(math.Ceil(float64(len(recentArr)) / 8))
		//if the length of recently uploaded is greater than 8 videos then return videos based off of page number (page 2 = 8 through 16)
		if len(recentArr) > 8 {
			if len(recentArr) > PageNum*8 {
				recentArr = recentArr[(PageNum-1)*8 : (PageNum)*8]

			} else { //if videos aren't of 8 videos at a time then return only the length that exists
				recentArr = recentArr[(PageNum-1)*8 : len(recentArr)]

			}
		}
		//if the length of most viewed is greater than 8 videos then return videos based off of page number (page 2 = 8 through 16)
		if len(mostViewedArr) > 8 {
			if len(mostViewedArr) > PageNum*8 {
				mostViewedArr = mostViewedArr[(PageNum-1)*8 : (PageNum)*8]

			} else { //if videos aren't of 8 videos at a time then return only the length that exists
				mostViewedArr = mostViewedArr[(PageNum-1)*8 : len(mostViewedArr)]
			}
		}
		//send response to frontend for profile pages (creator or user)
		response := struct {
			MostViewed   []Video
			RecentUpload []Video
			Pages        int
		}{

			MostViewed:   mostViewedArr,
			RecentUpload: recentArr,
			Pages:        pageAmount,
		}

		c.JSON(http.StatusOK, gin.H{"message": response})

	} else { //home page videos
		//create an array for most viewed and recently uploaded
		mostViewedArr := []Video{}
		recentArr := []Video{}
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
		defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
		// Firestore initialized
		sa := option.WithCredentialsFile("../serviceAccountKey.json")
		client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
		if err != nil {
			log.Fatalf("firestore client creation error:%s", err)
		}
		defer client.Close()
		//Gather all videos from Firestore under the Videos collection
		iter := client.Collection("Videos").Documents(ctx)
		for {
			doc, err := iter.Next()

			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}
			//create a vid variable of type Video and document data of video per iteration
			var vid = Video{}

			doc.DataTo(&vid)
			vid.ID = doc.Ref.ID
			//add profile pic of user of each video
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
			//add video that was iterated through to most viewed and recently uploaded array
			mostViewedArr = append(mostViewedArr, vid)
			recentArr = append(recentArr, vid)

		}
		//sort both most viewed and recently uploaded arrays
		sortMostViewed(mostViewedArr)
		sortRecent(recentArr)
		//create page amount variable to set the number of pages that exist (8 videos per page; 15 videos = 2 pages)
		var pageAmount int
		pageAmount = int(math.Ceil(float64(len(recentArr)) / 8))
		//if the length of recently uploaded is greater than 8 videos then return videos based off of page number (page 2 = 8 through 16)
		if len(recentArr) > 8 {
			if len(recentArr) > PageNum*8 {
				recentArr = recentArr[(PageNum-1)*8 : (PageNum)*8]

			} else { //if videos aren't of 8 videos at a time then return only the length that exists
				recentArr = recentArr[(PageNum-1)*8 : len(recentArr)]

			}
		}
		//if most viewed videos are more than a length of 8 videos, then only return the first 8 most viewed videos
		if len(mostViewedArr) > 8 {
			mostViewedArr = mostViewedArr[0:8]
		}
		//send response to frontend of most viewed videos, recently uploaded videos, and page amount
		response := struct {
			MostViewed   []Video
			RecentUpload []Video
			Pages        int
		}{

			MostViewed:   mostViewedArr,
			RecentUpload: recentArr,
			Pages:        pageAmount,

		}

		c.JSON(http.StatusOK, gin.H{"message": response})
	}
}
