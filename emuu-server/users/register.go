package users
import (

"encoding/json"
 "fmt"
 "io/ioutil"
 "log"
 "net/http"
 "github.com/gorilla/mux"
"context"
 "firebase.google.com/go/v4"
   "firebase.google.com/go/v4/auth"
   "google.golang.org/api/option"
)


 //Headers to allow host connection 3000 with 8081
 func corsAcceptance(w http.ResponseWriter, r *http.Request) {
     w.Header().Set("Content-Type", "application/json")
     w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000/Register")
     w.Header().Set("Access-Control-Max-Age", "15")
     w.Header().Set("Access-Control-Allow-Origin", "*");
     w.Header().Set("Access-Control-Allow-Credentials", "true");
     w.Header().Set("Access-Control-Allow-Methods", "GET; POST; OPTIONS");
     }



 //testing to get and output axios data
type RegisterUserInfo struct {

  User_firstName string `json:"user_firstName"`
  User_lastName string `json:"user_lastName"`
  User_userName string `json:"user_userName"`
  User_email string `json:"user_email"`
  User_password string `json:"user_password"`
}

//Create variable for firebase.app
var (
	firebaseApp *firebase.App
)

func createUser(w http.ResponseWriter, r *http.Request) {
    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        panic(err)
    }
   //log.Println(string(body))
    var account RegisterUserInfo
    err = json.Unmarshal(body, &account)
    if err != nil {
        panic(err)
    }


    fmt.Println(account.User_firstName)
    fmt.Println(account.User_lastName)
    fmt.Println(account.User_userName)
    fmt.Println(account.User_email)
    fmt.Println(account.User_password)
    fmt.Println("Registering User...", account.User_userName)


    //START OF FIREBASE CONNECTION AND REGISTRATION...
     //makes connection to Emuu's firebase server
        ctx:=context.Background()
    	opt:= option.WithCredentialsFile("../serviceAccountKey.json")
    	config := &firebase.Config{DatabaseURL: "https://emuu-1ee85-default-rtdb.firebaseio.com/",}
        //end of connection section

        //renames firebase.NewApp to app
    	app, err := firebase.NewApp(ctx, config, opt)
    	if err != nil {
    		log.Printf("error initializing app: %v\n", err)


    	}

    //renames app.Auth(ctx) to client
     client, err := app.Auth(ctx)
     if err != nil {
             log.Fatalf("error getting Auth client: %v\n", err)
     }

        //firebases paramaters for user registration
        params := (&auth.UserToCreate{}).
            Email(account.User_email).
            EmailVerified(false).
            Password(account.User_password).
            DisplayName(account.User_userName).
            Disabled(false)

        //creates user with set paramaters
        u, err := client.CreateUser(ctx, params)
        if err != nil {
            log.Fatalf("error creating user: %v\n", err)
        }
        log.Printf("Successfully created user: %v\n", u)
    	firebaseApp = app


     //END OF FIREBASE CONNECTION AND REGISTRATION...
  }

 func handleReqs() {
   r := mux.NewRouter().StrictSlash(true)
  r.HandleFunc("/", createUser).Methods("POST")

  log.Fatal(http.ListenAndServe(":8081", r))

 }




 func RegisterUser() {

     //allows host connection when running MainTest.go
    http.HandleFunc("/", corsAcceptance)

    //pulls data from register.js and stores it into firebase
    handleReqs();



   }
