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

func(u *UploadInfo) SetUploadInfo(username, title, description, tags, url string){
u.setUsername(username)
u.setTitle(title)
u.setDescription(description)
u.setTags(tags)
u.setUrl(url)

}
func(u *UploadInfo) getUsername() string {
return u.User_userName
}
func(u *UploadInfo) getTitle() string {
return u.Video_title
}
func(u *UploadInfo) getDescription() string {
return u.Video_description
}
func(u *UploadInfo) getTags() string {
return u.Game_tags
}
func(u *UploadInfo) getUrl() string {
return u.Video_url
}
func(u *UploadInfo) setUsername(username string){
u.User_userName= username;
}
func(u *UploadInfo) setTitle(title string){
u.Video_title= title;
}
func(u *UploadInfo) setDescription(description string){
u.Video_description= description;
}
func(u *UploadInfo) setTags(tags string){
u.Game_tags= tags;
}
func(u *UploadInfo) setUrl(url string){
u.Video_url= url;
}

func UploadVideo(c *gin.Context) {
	var input UploadInfo

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})//writter with particular error
		return
	}
    var u1 UploadInfo
	u1.setUploadInfo(input.User_userName, input.Video_title, input.Video_description, input.Game_tags, input.Video_url)
	fmt.Println(u1.getUsername(), ":", u1.getTitle(), ":", u1.getDescription(), ":", u1.getTags(), ":", u1.getUrl())

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

    id := uuid.New()
        wr, err := client.Collection("Videos").Doc(id.String()).Create(ctx, map[string]interface{}{
                "Username": input.User_userName,
                "VideoTitle": input.Video_title,
                "VideoDescription": input.Video_description,
                "GameTag": input.Game_tags,
                "VideoUrl": input.Video_url,
                "Comments": "",
                "Likes": 0,
                "Views": 0,
                "Date": Date,
                "uploadTime": currentTimestamp,

        })

        if err != nil {
                log.Fatalf("firestore doc creation error:%s\n", err)
        }
        fmt.Println(wr.UpdateTime)
        c.JSON(http.StatusOK, gin.H{"message": "User Upload collection successfully created"})



}