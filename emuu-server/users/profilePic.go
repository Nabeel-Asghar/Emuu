package users

import (
	"cloud.google.com/go/firestore"
	"context"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/option"
	"log"
	"time"
	"fmt"
"net/http"
)

type ProfileInfo struct {
	UserName   string `json:"displayName"`
	Image string `json:"profileImageUrl"`
}


func UpdateProfile(c *gin.Context) {
var input ProfileInfo
if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})//writter with particular error
		return
	}



ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
		defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error
		// Firestore initialized
		sa := option.WithCredentialsFile("../serviceAccountKey.json")
		client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
		if err != nil {
			log.Fatalf("firestore client creation error:%s", err)
		}
		defer client.Close()
 bannerUpdate, err := client.Collection("Users").Doc(input.UserName).Set(ctx, map[string]interface{}{
         "ProfilePictureUrl": input.Image,
 }, firestore.MergeAll)

 if err != nil {
        // Handle any errors in an appropriate way, such as returning them.
          fmt.Println(bannerUpdate.UpdateTime)
         log.Printf("An error has occurred: %s", err)
 }



}

