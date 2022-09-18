package main


import (
	"log"
	"emuu-server/main/firebase"
	status "emuu-server/main/status"
    //"emuu-server/main/models"
	"github.com/gin-gonic/gin"
	//"fmt"


)





func main() {

	err := firebase.Init()

	//myuser :=newUser("Mario","abidulamin013@gmail.com", "covac", "john","yellow123")
	//fmt.Println(myuser)

	if err != nil {
		log.Fatalf("error initializing firebase %v", err)
	}
	log.Println("Firebase Connected")
	router := gin.Default()

    	router.GET("/status", status.Status)


    	//router.POST("/register", register.RegisterUser)

    	router.Run()
}
// main()


