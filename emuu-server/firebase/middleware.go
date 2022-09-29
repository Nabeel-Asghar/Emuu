package firebase

import (
	"net/http"
	"strings"

	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
)

// func corsAcceptance(w http.ResponseWriter, r *http.Request) {
// // 	w.Header().Set("Content-Type", "application/json")
// // 	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000/Register")
// // 	w.Header().Set("Access-Control-Max-Age", "15")
// 	w.Header().Set("Access-Control-Allow-Origin", "*")
// w.Header().Set("Access-Control-Allow-Credentials", "true")
// w.Header().Set("Access-Control-Allow-Methods", "GET; POST; OPTIONS")
// }
const (
	authorizationHeader = "Authorization"
// 	apiKeyHeader        = "X-API-Key"
// 	cronExecutedHeader  = "x-Appengine-Cron"
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
