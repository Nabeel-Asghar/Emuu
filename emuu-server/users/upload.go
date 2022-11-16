package users

import (
	"cloud.google.com/go/firestore"
	"context"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"google.golang.org/api/option"
	"log"
	"net/http"
	"net/smtp"
	"time"
)

// set struct for user info
type UploadInfo struct {
	User_userName     string `json:"user_userName"`
	Video_title       string `json:"video_title"`
	Video_description string `json:"video_description"`
	Game_tags         string `json:"video_gameTags"`
	Video_url         string `json:"video_url"`
	Thumbnail_url     string `json:"thumbnail_url"`
}
type Subscribers struct {
	SubscriberArray []string `firestore:"SubscriberList"`
}
type Email struct {
	Email string `firestore:"Email"`
}

func (u *UploadInfo) SetUploadInfo(username string, title string, description string, tags string, Videourl string, Thumburl string) {
	u.setUsername(username)
	u.setTitle(title)
	u.setDescription(description)
	u.setTags(tags)
	u.setvidUrl(Videourl)
	u.setthumbUrl(Thumburl)

}
func (u *UploadInfo) getUsername() string {
	return u.User_userName
}
func (u *UploadInfo) getTitle() string {
	return u.Video_title
}
func (u *UploadInfo) getDescription() string {
	return u.Video_description
}
func (u *UploadInfo) getTags() string {
	return u.Game_tags
}
func (u *UploadInfo) getvidUrl() string {
	return u.Video_url
}
func (u *UploadInfo) getthumbUrl() string {
	return u.Thumbnail_url
}
func (u *UploadInfo) setUsername(username string) {
	u.User_userName = username
}
func (u *UploadInfo) setTitle(title string) {
	u.Video_title = title
}
func (u *UploadInfo) setDescription(description string) {
	u.Video_description = description
}
func (u *UploadInfo) setTags(tags string) {
	u.Game_tags = tags
}
func (u *UploadInfo) setvidUrl(url string) {
	u.Video_url = url
}
func (u *UploadInfo) setthumbUrl(url string) {
	u.Thumbnail_url = url
}
func UploadVideo(c *gin.Context) {
	var input UploadInfo

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) //writter with particular error
		return
	}
	var u1 UploadInfo
	u1.SetUploadInfo(input.User_userName, input.Video_title, input.Video_description, input.Game_tags, input.Video_url, input.Thumbnail_url)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error

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

	//Declare usersThatLiked array
	usersThatLikedArr := [...]string{}

	id := uuid.New()
	wr, err := client.Collection("Videos").Doc(id.String()).Create(ctx, map[string]interface{}{
		"Username":         u1.getUsername(),
		"VideoTitle":       u1.getTitle(),
		"VideoDescription": u1.getDescription(),
		"GameTag":          u1.getTags(),
		"VideoUrl":         u1.getvidUrl(),
		"thumbnailUrl":     u1.getthumbUrl(),
		"Comments":         "",
		"Likes":            0,
		"Views":            0,
		"Date":             Date,
		"uploadTime":       currentTimestamp,
		"usersThatLiked":   usersThatLikedArr,
	})

	if err != nil {
		log.Fatalf("firestore doc creation error:%s\n", err)
		log.Println(wr)
	}

	dc := client.Collection("Users").Doc(input.User_userName)
	_, err = dc.Update(ctx, []firestore.Update{
		{Path: "VideosPosted", Value: firestore.Increment(1)},
	})

	dsnap, err := client.Collection("Users").Doc(input.User_userName).Get(ctx)

	var subscribe Subscribers
	dsnap.DataTo(&subscribe)

	for i := 0; i < len(subscribe.SubscriberArray); i++ {
		dsnap, err := client.Collection("Users").Doc(subscribe.SubscriberArray[i]).Get(ctx)
		var email Email
		dsnap.DataTo(&email)
		auth := smtp.PlainAuth(
			"",
			"emuu.1ee85@gmail.com",
			"eoierbcuhucaexew",
			"smtp.gmail.com",
		)

		msg := "Subject: " + input.User_userName + " has uploaded a video\nCheck out the latest video posted by " + input.User_userName + " on the EMUU application"

		err = smtp.SendMail(
			"smtp.gmail.com:587",
			auth,
			"emuu.1ee85@gmail.com",
			[]string{email.Email},
			[]byte(msg),
		)

		if err != nil {
			fmt.Println(err)

		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "User Upload collection successfully created"})

}
