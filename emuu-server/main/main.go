package main

import (
	//"fmt"
    "log"
    //"net/http"
	"emuu-server/main/firebase"
	//status "emuu-server/main/status"
 	register "emuu-server/main/users"
	//"github.com/gin-gonic/gin"
)

func main() {
	err := firebase.Init()
	if err != nil {
		log.Fatalf("error initializing firebase %v", err)
	}
	log.Println("Firebase Connected")
	//router := gin.Default()

    	//router.GET("/status", status.Status)
    	//router.POST("/register", register.RegisterUser)

    	//router.Run()
    	register.RegisterUser()
}



