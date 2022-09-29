package users

import (
	"context"
	"log"
	"net/http"
	"time"

	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
)

//Headers to allow host connection 3000 with 8081
// func corsAcceptance(w http.ResponseWriter, r *http.Request) {
// 	w.Header().Set("Content-Type", "application/json")
// 	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000/Register")
// 	w.Header().Set("Access-Control-Max-Age", "15")
// 	w.Header().Set("Access-Control-Allow-Origin", "*")
// 	w.Header().Set("Access-Control-Allow-Credentials", "true")
// 	w.Header().Set("Access-Control-Allow-Methods", "GET; POST; OPTIONS")
// }

//testing to get and output axios data

//set struct for user info
type RegisterUserInfo struct {
	User_firstName string `json:"user_firstName"`
	User_lastName  string `json:"user_lastName"`
	User_userName  string `json:"user_userName"`
	User_email     string `json:"user_email"`
	User_password  string `json:"user_password"`
}
//create user function, removed gorilla mux handler and used gin gonic handler see line 34
func CreateUser(c *gin.Context) {
	var input RegisterUserInfo
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})//writter with particular error
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15
	defer cancel() //after 15 seconds, if the function is not executed it will cancel and throw an error

    //Firebase connection
	firebaseAuth := c.MustGet("firebaseAuth").(*auth.Client)
	//firebaseAuth := firebaseSer.InitAuth()

	//firebases paramaters for user registration
	params := (&auth.UserToCreate{}).
		Email(input.User_email).
		EmailVerified(false).
		Password(input.User_password).
		DisplayName(input.User_userName).
		Disabled(false)

	u, err := firebaseAuth.CreateUser(ctx, params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Println(u)

	c.JSON(http.StatusOK, gin.H{"message": "User successfully created"})
}




// func handleReqs() {
// 	// r := mux.NewRouter().StrictSlash(true)
// 	// r.HandleFunc("/", createUser).Methods("POST")
// 	// log.Fatal(http.ListenAndServe(":8081", r))

// 	// routes definition for finding and creating artists
// 	r.GET("/", api.FindArtists)
// 	r.POST("/artist", api.CreateArtist)
// }

// func RegisterUser() {
// 	//allows host connection when running MainTest.go
// 	http.HandleFunc("/", corsAcceptance)
// 	//pulls data from register.js and stores it into firebase
// 	handleReqs()
// }
