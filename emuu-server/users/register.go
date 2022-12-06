package users

import (
	"cloud.google.com/go/firestore"
	"context"
	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
	"log"
	"net/http"
	"time"
	"fmt"
)

// set struct for user info
type RegisterUserInfo struct {
	User_firstName string `json:"user_firstName"`
	User_lastName  string `json:"user_lastName"`
	User_userName  string `json:"user_userName"`
	User_email     string `json:"user_email"`
	User_password  string `json:"user_password"`
}
type ExistUser struct{
    User_userName  string `firestore:"Username"`
	User_email     string `firestore:"Email"`
}
// create user function, removed gorilla mux handler and used gin gonic handler see line 34
func CreateUser(c *gin.Context) {
	var input RegisterUserInfo
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()}) //writter with particular error
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel()
	                                                     //after 15 seconds, if the function is not executed it will cancel and throw an error
    // Firestore initialized
    	sa := option.WithCredentialsFile("../serviceAccountKey.json")
    	client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
    	if err != nil {
    		log.Fatalf("firestore client creation error:%s\n", err)
    	}
    	defer client.Close()
//     	Checking duplicate username
    	var existingUser ExistUser
    userRef := client.Doc("Users/"+input.User_userName)
       docsnap, err := userRef.Get(ctx)
       if err != nil {
       }
       dataMap := docsnap.DataTo(&existingUser)
       fmt.Println(dataMap)
       if(existingUser.User_userName == input.User_userName){
       c.JSON(400, gin.H{"error": "Username already in use"})
       		return
       }
//        checking duplicate email
            var existingEmail ExistUser
           userEmailRef := client.Collection("Users").Where("Email", "==", input.User_email).Documents(ctx)

             for {
                     doc, err := userEmailRef.Next()
                     if err == iterator.Done {
                             break
                     }
                     if err != nil {
                             return
                     }
                     doc.DataTo(&existingEmail)
                     if(existingEmail.User_email == input.User_email){
                                   c.JSON(400, gin.H{"error": "Email already in use"})
                                   		return
                                   }
             }

	//Firebase connection
	firebaseAuth := c.MustGet("firebaseAuth").(*auth.Client)

	//firebases paramaters for user registration
	params := (&auth.UserToCreate{}).
		Email(input.User_email).
		EmailVerified(false).
		Password(input.User_password).
		DisplayName(input.User_userName).
		PhotoURL("https://i.stack.imgur.com/l60Hf.png").
		Disabled(false)

	u, err := firebaseAuth.CreateUser(ctx, params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}


	//Get Time
	dt := time.Now()
	//Format Time
	Date := dt.Format("01-02-2006")
	//Create subscribers list array
	SubscriberListArr := [...]string{}
	//Create a user document based off of username and add fields to the document
	wr, err := client.Collection("Users").Doc(input.User_userName).Create(ctx, map[string]interface{}{
		"Username":          input.User_userName,
		"SubscriberCount":   0,
		"LikedVideosList":   "",
		"SubscriberList":    SubscriberListArr,
		"BannerUrl":         "http://mcentre.lk/frontend/assets/images/default-banner.png",
		"ProfilePictureUrl": "https://i.stack.imgur.com/l60Hf.png",
		"VideosPosted":      0,
		"DateJoined":        Date,
		"Email":             input.User_email,
	})

	if err != nil {
		log.Fatalf("firestore doc creation error:%s\n", err)
		log.Println(u)
		log.Println(wr)
	}

	c.JSON(http.StatusOK, gin.H{"message": "User successfully created"})
}
