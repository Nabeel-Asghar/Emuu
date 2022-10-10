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
}


func UploadVideo(c *gin.Context) {
	var input UploadInfo
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})//writter with particular error
		return
	}

   ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
   defer cancel() //after 15 seconds, if the function is not executed it will cancel and throw an error

   sa := option.WithCredentialsFile("../serviceAccountKey.json")
   client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
   if err != nil {
        log.Fatalf("firestore client creation error:%s\n", err)
   }
   defer client.Close()

   //Get current date and time
    currentTimestamp := time.Now().Unix()
    currentDate := time.Unix(currentTimestamp, 0)

    id := uuid.New()
        wr, err := client.Collection("Videos").Doc(id.String()).Create(ctx, map[string]interface{}{
                "Username": input.User_userName,
                "Video Title": input.Video_title,
                "Video Description": input.Video_description,
                "Game Tag": input.Game_tags,
                "Video url": input.Video_url,
                "Comments": "",
                "Likes": 0,
                "Views": 0,
                "Date": currentDate,

        })

        if err != nil {
                log.Fatalf("firestore doc creation error:%s\n", err)
        }
        fmt.Println(wr.UpdateTime)
        c.JSON(http.StatusOK, gin.H{"message": "User Upload collection successfully created"})



}