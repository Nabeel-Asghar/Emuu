package video

import (
	"cloud.google.com/go/firestore"
	"context"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
	"log"
	"math"
	"net/http"
	"reflect"
	"strconv"
	"time"
)

type DisplayNameAndPage struct {
	UserName   string `json:"displayName"`
	PageNumber string `json:"pageNumber"`
}

var userUN string
var PageNum int

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

	ProfilePic string
}
type User struct {
	ProfilePicture string `firestore:"ProfilePictureUrl"`
}

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
func SetUsernameAndPage(c *gin.Context) {
	var res DisplayNameAndPage
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName
	PageNum, _ = strconv.Atoi(res.PageNumber)

}

func SetVideos(c *gin.Context) {
	if userUN != "" {
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
		iter := client.Collection("Videos").Where("Username", "==", userUN).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}
			var vid = Video{}

			doc.DataTo(&vid)
			mostViewedArr = append(mostViewedArr, vid)
			recentArr = append(recentArr, vid)
		}
		sortMostViewed(mostViewedArr)
		sortRecent(recentArr)
		var pageAmount int
		pageAmount = int(math.Ceil(float64(len(recentArr)) / 8))
		if len(recentArr) > 3 {
			if len(recentArr) > PageNum*8 {
				recentArr = recentArr[(PageNum-1)*8 : (PageNum)*8]

			} else {
				recentArr = recentArr[(PageNum-1)*8 : len(recentArr)]

			}
		}
		if len(mostViewedArr) > 8 {
			if len(mostViewedArr) > PageNum*8 {
				mostViewedArr = mostViewedArr[(PageNum-1)*8 : (PageNum)*8]

			} else {
				mostViewedArr = mostViewedArr[(PageNum-1)*8 : len(mostViewedArr)]
			}
		}
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

	} else {
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
		iter := client.Collection("Videos").Documents(ctx)
		for {
			doc, err := iter.Next()
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
				reflect.ValueOf(&vid).Elem().FieldByName("ProfilePic").SetString(profilePic.ProfilePicture)

			}
			mostViewedArr = append(mostViewedArr, vid)
			recentArr = append(recentArr, vid)

		}

		sortMostViewed(mostViewedArr)
		sortRecent(recentArr)

		var pageAmount int
		pageAmount = int(math.Ceil(float64(len(recentArr)) / 8))
		if len(recentArr) > 8 {
			if len(recentArr) > PageNum*8 {
				recentArr = recentArr[(PageNum-1)*8 : (PageNum)*8]

			} else {
				recentArr = recentArr[(PageNum-1)*8 : len(recentArr)]

			}
		}

		if len(mostViewedArr) > 8 {
			mostViewedArr = mostViewedArr[0:8]
		}

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
