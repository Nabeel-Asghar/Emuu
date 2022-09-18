package main

import (

    "log"

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
	//register.RegisterUser()

}



