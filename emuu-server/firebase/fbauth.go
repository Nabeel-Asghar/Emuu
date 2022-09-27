package firebase

import (
	"context"
	"log"
	"path/filepath"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"
)

var (
	firebaseConfigFile = "../serviceAccountKey.json"
)

func InitAuth() *auth.Client { //client library
	path, err := filepath.Abs(firebaseConfigFile) //used absolute path
	if err != nil {
		panic("Firebase load error")
		//return nil, errors.Wrap(err, "error initializing firebase auth (create firebase app")
	}

	opt := option.WithCredentialsFile(path) //path is the absolute
	//Firebase admin SDK initialization
	app, err := firebase.NewApp(context.Background(), nil, opt)
	if err != nil {
		panic("Firebase load error")
		//return nil, errors.Wrap(err, "error initializing firebase auth (create firebase app")
	}

	//Firebase Auth
	auth, err := app.Auth(context.Background()) //this is the auth client refer to line 17
	if err != nil {
		log.Println(err)
		panic("Firebase load error")
	}
	return auth

}
