package video

import (
	"context"
	"log"
	"net/http"
	"time"
   "cloud.google.com/go/firestore"
	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
	"fmt"
	"google.golang.org/api/option"
)


type Video struct{
    userName string `firestore:"Username,omitempty"`
	title string `firestore:"VideoTitle,omitempty"`
	videoUrl string `firestore:"VideoUrl,omitempty"`
	thumbnailUrl string `firestore:"thumbnailUrl,omitempty"`
	Like int `firestore:"Likes,omitempty"`
	View int `firestore:"Views,omitempty"`
	upload int `firestore:"uploadTime,omitempty"`
}

func sortMostViewed(videos[]Video)[]Video{

 for i:=0; i< len(videos)-1; i++ {
      for j:=0; j < len(videos)-i-1; j++ {
         if (videos[j].View > videos[j+1].View) {
            videos[j], array[j+1] = videos[j+1], array[j]
         }
      }
   }
   return videos
}

func sortRecent(videos[]Video)[]Video{

 for i:=0; i< len(videos)-1; i++ {
      for j:=0; j < len(videos)-i-1; j++ {
         if (videos[j].upload > videos[j+1].upload) {
            videos[j], array[j+1] = videos[j+1], array[j]
         }
      }
   }
   return videos
}



func SetVideos(c *gin.Context) {
     mostViewedArr := [...]Video{}
     recentArr := [...]Video{}
     var i = 0
     var j = 0

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel() //after 15 seconds, if the function is not executed it will cancel and throw an error

    //Firebase connection
	firebaseAuth := c.MustGet("firebaseAuth").(*auth.Client)

     // Firestore initialized
	  sa := option.WithCredentialsFile("../serviceAccountKey.json")
       client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
       if err != nil {
            log.Fatalf("firestore client creation error:%s\n", err)
       }
       defer client.Close()


iter := client.Collection("Videos").Documents(ctx)
for {
        doc, err := iter.Next()
        if err == iterator.Done {
                break
        }
        if err != nil {
                return err
        }
        fmt.Println(doc.Data())
        mostViewedArr[i] = doc.Data()
        i++
}
sortMostViewed(mostViewedArr)
var mV []Video = mostViewedArr[0:8]
iter2 := client.Collection("Videos").Documents(ctx)
for {
        doc, err := iter2.Next()
        if err == iterator.Done {
                break
        }
        if err != nil {
                return err
        }
        fmt.Println(doc.Data())
        recentArr[j] = doc.Data()
        j++
}
sortRecent(recentArr)
	c.JSON(http.StatusOK, gin.H{"message": "Videos successfully added"})
}



