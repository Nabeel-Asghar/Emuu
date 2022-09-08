package main

import (
	"emuu-server/main/status"
	"emuu-server/main/users"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.GET("/status", status.Status)
	router.POST("/register", users.RegisterUser)

	router.Run()
}
