package main

import (
	firebaseSer "emuu-server/main/firebase"
	register "emuu-server/main/users"
	"fmt"
	"log"
	upload "emuu-server/main/users"
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	video "emuu-server/main/video"
)


func main() {
	fmt.Println("Host 8080 Listening...")
	// initialize new gin engine (for server)
	r := gin.Default() //default router

	r.Use(cors.Default())
	// configure firebase
	firebaseAuth := firebaseSer.InitAuth()//calling firebase auth client

	// set db & firebase auth to gin context with a middleware to all incoming request
	r.Use(func(c *gin.Context) { //register that function library
		c.Set("firebaseAuth", firebaseAuth)
	})

	auth := r.Group("auth") //group is in the gin gonic framework,if you want to create login forgot password, you can create it
	{
		auth.POST("/upload", upload.UploadVideo)
		auth.POST("/register", register.CreateUser)
		auth.GET("/video", video.SetVideos)

	}

	api := r.Group("api").Use(firebaseSer.AuthJWT)//create a new router with the middleware authJWT
	{//you should supply the jwt token from firebase
		api.POST("/", func(ctx *gin.Context) {
			fmt.Println("Hello")

		})
	}

	log.Println("Server started at 8080")
	r.Run(":8080")
}
