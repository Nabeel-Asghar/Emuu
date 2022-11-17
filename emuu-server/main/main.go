package main

import (
	firebaseSer "emuu-server/main/firebase"
	creator "emuu-server/main/users"
	cropImage "emuu-server/main/users"
	likedVideos "emuu-server/main/users"
	navbar "emuu-server/main/users"
	profilePic "emuu-server/main/users"
	register "emuu-server/main/users"
	subscriber "emuu-server/main/users"
	subscriberButton "emuu-server/main/users"
	subscription "emuu-server/main/users"
	upload "emuu-server/main/users"
	comment "emuu-server/main/video"
	likes "emuu-server/main/video"
	video "emuu-server/main/video"
	view "emuu-server/main/video"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// initialize new gin engine (for server)
	r := gin.Default() //default router

	r.Use(cors.Default())
	// configure firebase
	firebaseAuth := firebaseSer.InitAuth() //calling firebase auth client

	// set db & firebase auth to gin context with a middleware to all incoming request
	r.Use(func(c *gin.Context) { //register that function library
		c.Set("firebaseAuth", firebaseAuth)
	})

	auth := r.Group("auth") //group is in the gin gonic framework,if you want to create login forgot password, you can create it
	{
		auth.POST("/upload", upload.UploadVideo)
		auth.POST("/register", register.CreateUser)
		auth.POST("/video", video.SetUsernameAndPage)
		auth.GET("/video", video.SetVideos)
		auth.POST("/creator", creator.SetUsername)
		auth.GET("/creator", creator.SetUser)
		auth.POST("/updateBanner", cropImage.UpdateBanner)
		auth.POST("/updateProfilePic", profilePic.UpdateProfile)
		auth.POST("/LikeVideo", likes.SetLikes)
		auth.POST("/CheckLikeVideo", likes.SetUsernameLike)
		auth.GET("/CheckLikeVideo", likes.CheckLikes)
		auth.POST("/Subscribers", subscriber.SetUsernameSub)
		auth.GET("/Subscribers", subscriber.SetSubscribers)
		auth.POST("/Subscription", subscription.SetUsernameSubscription)
		auth.GET("/Subscription", subscriber.SetSubscriptions)
		auth.POST("/comment", comment.SetComment)
		auth.GET("/comment", comment.GetComment)
		auth.POST("/SubscribeButton", subscriberButton.SetSubscribe)
		auth.POST("/CheckSubscribe", subscriberButton.SetUserAndCreator)
		auth.GET("/CheckSubscribe", subscriberButton.CheckSub)
		auth.POST("/navbar", navbar.SetNavUsername)
		auth.GET("/navbar", navbar.SetNavUser)
		auth.POST("/likedvideo", likedVideos.SetUsernameLiked)
		auth.GET("/likedvideo", likedVideos.SetLikedVideos)
		auth.POST("/view", view.UpdateView)
	}

	api := r.Group("api").Use(firebaseSer.AuthJWT) //create a new router with the middleware authJWT
	{ //you should supply the jwt token from firebase
		api.POST("/", func(ctx *gin.Context) {

		})
	}

	r.Run(":8080")
}
