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

type user1 struct{
UserName string
Email string
FirstName string
LastName string
Password string
}

func newUser(UserName string,Email string,FirstName string, LastName string, Password string) user1{
u:= user1{
    UserName:UserName,
    Email:Email,
    FirstName:FirstName,
    LastName:LastName,
    Password:Password,

}
return u

}



func Init() error {


    ctx:=context.Background()
	opt:= option.WithCredentialsFile("../serviceAccountKey.json")
	config := &firebase.Config{DatabaseURL: "https://emuu-1ee85-default-rtdb.firebaseio.com/",}

	app, err := firebase.NewApp(ctx, config, opt)
	if err != nil {
		log.Printf("error initializing app: %v\n", err)

		return err
	}
	client, err := app.Database(ctx)
    if err != nil {
      log.Fatal(err)
    }


	myuser :=newUser("test","test@gmail.com", "test", "number1","test123")

	if err := client.NewRef("accounts").Set(ctx, myuser); err != nil {
      log.Fatal(err)
    }

	firebaseApp = app

	return nil
}
