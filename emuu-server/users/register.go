package users
import (

"encoding/json"
  "fmt"
  "io/ioutil"
  "log"
  "net/http"
 "github.com/gorilla/mux"


)

 //Headers to allow host connection 3000 with 8080
 func corsAcceptance(w http.ResponseWriter, r *http.Request) {
     w.Header().Set("Content-Type", "application/json")
     w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000/register")
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


func createUser(w http.ResponseWriter, r *http.Request) {
    body, err := ioutil.ReadAll(r.Body)
    if err != nil {
        panic(err)
    }
   // log.Println(string(body))
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


  }

 func handleReqs() {
   r := mux.NewRouter().StrictSlash(true)
  r.HandleFunc("/", createUser).Methods("POST")

  log.Fatal(http.ListenAndServe(":8080/register", r))
 }


 func RegisterUser() {

 //allows host connection when running MainTest.go
    http.HandleFunc("/register", corsAcceptance)

    fmt.Printf("Registering User...\n")
    handleReqs();

    }
