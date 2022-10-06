package firebase
import (
  "log"
"context"
  firebase "firebase.google.com/go"
  "google.golang.org/api/option"
)

func InitStore() { //client library

// Use a service account
ctx := context.Background()
sa := option.WithCredentialsFile("../serviceAccountKey.json")
app, err := firebase.NewApp(ctx, nil, sa)
if err != nil {
  log.Println(err)
}

client, err := app.Firestore(ctx)
if err != nil {
  log.Println(err)
}
defer client.Close()
}