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

type DisplayName struct {
	UserName string `json:"displayName"`
}

var userUN string

type Video struct {
	Username         string   `firestore:"Username"`
	Title            string   `firestore:"VideoTitle"`
	VideoUrl         string   `firestore:"VideoUrl"`
	ThumbnailUrl     string   `firestore:"thumbnailUrl"`
	Likes            int      `firestore:"Likes"`
	Views            int      `firestore:"Views"`
	UploadTime       int      `firestore:"uploadTime"`
	Date             string   `firestore:"Date"`
	GameTag          string   `firestore:"GameTag"`
	VideoDescription string   `firestore:"VideoDescription"`
	UsersThatLiked   []string `firestore:"usersThatLiked"`
	//Comments         []map[string]interface{} `firestore:"Comments"`
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
func SetUsername(c *gin.Context) {
	var res DisplayName
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res.UserName})
	userUN = res.UserName
	fmt.Println(userUN)
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
			fmt.Println(doc.Data())
			var vid = Video{}

			doc.DataTo(&vid)
			//fmt.Printf("Document data: %#v", vid)
			//fmt.Println(doc.Data())
			mostViewedArr = append(mostViewedArr, vid)
			recentArr = append(recentArr, vid)
		}
		sortMostViewed(mostViewedArr)
		sortRecent(recentArr)

		response := struct {
			MostViewed   []Video
			RecentUpload []Video
		}{
			//MostViewed:   mostViewedArr[0:8],
			RecentUpload: recentArr,
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
			fmt.Printf("Document data: %#v", vid)
			fmt.Println(doc.Data())
			mostViewedArr = append(mostViewedArr, vid)
			recentArr = append(recentArr, vid)
		}
		sortMostViewed(mostViewedArr)
		sortRecent(recentArr)

		response := struct {
			MostViewed   []Video
			RecentUpload []Video
		}{
			MostViewed:   mostViewedArr[0:7],
			RecentUpload: recentArr,
		}

		c.JSON(http.StatusOK, gin.H{"message": response})
	}
}
