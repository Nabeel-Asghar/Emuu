package firebase

import (
   "context"
   "log"
     "firebase.google.com/go/v4"
     "firebase.google.com/go/v4/auth"

     //"firebase.google.com/go/v4/messaging"
   "google.golang.org/api/option"
   register "emuu-server/main/users"
)


var (
   firebaseApp *firebase.App
)


func Init() error {
    ctx:=context.Background()
   opt:= option.WithCredentialsFile("../serviceAccountKey.json")
   config := &firebase.Config{DatabaseURL: "https://emuu-1ee85-default-rtdb.firebaseio.com/",}

   app, err := firebase.NewApp(ctx, config, opt)
   if err != nil {
      log.Printf("error initializing app: %v\n", err)

      return err
   }
 client, err := app.Auth(ctx)
 if err != nil {
         log.Fatalf("error getting Auth client: %v\n", err)
 }
    params := (&auth.UserToCreate{}).
        Email(account.User_email).
        EmailVerified(false).
        Password(account.User_password).
        DisplayName(account.User_userName).
        Disabled(false)
    u, err := client.CreateUser(ctx, params)
    if err != nil {
        log.Fatalf("error creating user: %v\n", err)
    }
    log.Printf("Successfully created user: %v\n", u)

   firebaseApp = app

   return nil
}
