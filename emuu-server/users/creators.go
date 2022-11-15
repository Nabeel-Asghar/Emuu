package users

import (
	"cloud.google.com/go/firestore"
	"context"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
	"log"
	"net/http"
	"time"
)

type DisplayName struct {
	UserName   string `json:"displayName"`
}

var userUN string

type User struct {
	Username         string   `firestore:"Username"`
	BannerUrl            string   `firestore:"BannerUrl"`
	DateJoined        string   `firestore:"DateJoined"`
	ProfilePictureUrl         string      `firestore:"ProfilePictureUrl"`
	SubscriberCount            int      `firestore:"SubscriberCount"`

}

func SetUsername(c *gin.Context) {
	var res DisplayName
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName

}


func SetUser(c *gin.Context) {
	if userUN != "" {
		userDataArr := []User{}
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
		defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
		// Firestore initialized
		sa := option.WithCredentialsFile("../serviceAccountKey.json")
		client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
		if err != nil {
			log.Fatalf("firestore client creation error:%s", err)
		}
		defer client.Close()
		iter := client.Collection("Users").Where("Username", "==", userUN).Documents(ctx)
		for {
			doc, err := iter.Next()
			if err == iterator.Done {
				break
			}
			if err != nil {
				return
			}
			var userInfo = User{}

			doc.DataTo(&userInfo)
			userDataArr = append(userDataArr, userInfo)

		}

		response := struct {
			UserDetails   []User
		}{

			UserDetails:   userDataArr,

		}

		c.JSON(http.StatusOK, gin.H{"message": response})

	}
}
