package firebase

import (
	"net/http"
	"strings"

	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
)


const (
	authorizationHeader = "Authorization"
	valName             = "FIREBASE_ID_TOKEN"
)

func AuthJWT(c *gin.Context) {
	firebaseAuth := c.MustGet("firebaseAuth").(*auth.Client)//retrieving firebase auth client from gin context

	authorizationToken := c.GetHeader("Authorization") //getting the authorizationHeader
	token := strings.TrimSpace(strings.Replace(authorizationToken, "Bearer", "", 1))//splitting the token from header
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Id token not available"})
		c.Abort()
		return
	}

	idToken, err := firebaseAuth.VerifyIDToken(c, token) //checking if token exists in firebase
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": http.StatusText(http.StatusUnauthorized),//return error 401 if unauthorized
		})
		c.Abort()
		return
	}
	c.Set(valName, idToken)
	c.Next()
}
