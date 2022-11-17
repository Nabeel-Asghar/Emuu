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

type NavBarName struct {
	UserName string `json:"displayName"`
}

type NavBarUser struct {
	Username          string `firestore:"Username"`
	BannerUrl         string `firestore:"BannerUrl"`
	DateJoined        string `firestore:"DateJoined"`
	ProfilePictureUrl string `firestore:"ProfilePictureUrl"`
	SubscriberCount   int    `firestore:"SubscriberCount"`
}

func SetNavUsername(c *gin.Context) {
	var res DisplayName
	c.ShouldBindJSON(&res)
	c.JSON(http.StatusOK, gin.H{"message": res})
	userUN = res.UserName

}

func SetNavUser(c *gin.Context) {
	if userUN != "" {
		userDataArr := []NavBarUser{}
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
			var userInfo = NavBarUser{}

			doc.DataTo(&userInfo)
			userDataArr = append(userDataArr, userInfo)

		}

		response := struct {
			UserDetails []NavBarUser
		}{

			UserDetails: userDataArr,
		}

		c.JSON(http.StatusOK, gin.H{"message": response})

	}
}
