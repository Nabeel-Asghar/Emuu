package users

import (
   "context"
    "time"
   "fmt"
   "log"
   "net/http"
   "github.com/gin-gonic/gin"
   "cloud.google.com/go/firestore"
   "google.golang.org/api/option"
   "github.com/google/uuid"
)

//set struct for user info
type UploadInfo struct {
	User_userName string `json:"user_userName"`
	Video_title string `json:"video_title"`
	Video_description string `json:"video_description"`
	Game_tags string `json:"video_gameTags"`
	Video_url string `json:"video_url"`
	Thumbnail_url string `json:"thumbnail_url"`
}


func UploadVideo(c *gin.Context) {
	var input UploadInfo
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})//writter with particular error
		return
	}

   ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
   defer cancel() //after 15 seconds, if the function is not executed it will cancel and throw an error


        // Firestore initialized
   sa := option.WithCredentialsFile("../serviceAccountKey.json")
   client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
   if err != nil {
        log.Fatalf("firestore client creation error:%s\n", err)
   }
   defer client.Close()

   //Get current date and time
    currentTimestamp := time.Now().Unix()
    //Get Time
       dt := time.Now()
    //Format Time
      Date := dt.Format("01-02-2006")

     //Declare comments array
  /*
     commentsArr := [...]map[string]interface{}{
     "date": "test",
     "postedBy": "user",
     "text": "test",
     }
*/
     //Declare usersThatLiked array
     usersThatLikedArr := [...]string{}

    id := uuid.New()
        wr, err := client.Collection("Videos").Doc(id.String()).Create(ctx, map[string]interface{}{
                "Username": input.User_userName,
                "VideoTitle": input.Video_title,
                "VideoDescription": input.Video_description,
                "GameTag": input.Game_tags,
                "VideoUrl": input.Video_url,
                "Likes": 0,
                "Views": 0,
                "Date": Date,
                "uploadTime": currentTimestamp,
                "Comments": "",
                "usersThatLiked": usersThatLikedArr,
                "thumbnailUrl": input.Thumbnail_url,


        })

        if err != nil {
                log.Fatalf("firestore doc creation error:%s\n", err)
        }


        fmt.Println(wr.UpdateTime, wr.UpdateTime)
        c.JSON(http.StatusOK, gin.H{"message": "User Upload collection successfully created"})



}