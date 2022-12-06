package firebase

import (
	"cloud.google.com/go/firestore"
	"context"
	"google.golang.org/api/option"
	"log"
	"time"
)

func InitFbStore() {
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*15) //setting context with timeout 15 seconds
	defer cancel()                                                           //after 15 seconds, if the function is not executed it will cancel and throw an error

	//initialize firestore client with serviceAccountkey details
	sa := option.WithCredentialsFile("../serviceAccountKey.json")
	client, err := firestore.NewClient(ctx, "emuu-1ee85", sa)
	if err != nil {
		log.Fatalf("firestore client creation error:%s\n", err)
	}
	defer client.Close()

}
