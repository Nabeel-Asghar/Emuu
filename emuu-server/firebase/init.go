package firebase

import (
	"context"
	"log"

firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
)

var (
	firebaseApp *firebase.App
)

func Init() error {
	opt:= option.WithCredentialsFile("./serviceAccountKey.json")
	config := &firebase.Config{ProjectID: "emuu-1ee85"}q
	app, err := firebase.NewApp(context.Background(), config, opt)
	if err != nil {
		log.Printf("error initializing app: %v\n", err)

		return err
	}

	firebaseApp = app

	return nil
}
