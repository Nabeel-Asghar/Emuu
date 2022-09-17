package main

import (


     "fmt"
     "net/http"
     "log"
     "encoding/json"

)

type requestBody struct {
    Test       string `json:"userdata"`
}

//Headers to allow host connection 3000 with 8080
func corsAcceptance(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
    w.Header().Set("Access-Control-Max-Age", "15")
    w.Header().Set("Access-Control-Allow-Origin", "*");
    w.Header().Set("Access-Control-Allow-Credentials", "true");
    w.Header().Set("Access-Control-Allow-Methods", "GET; POST; OPTIONS");
    }

    //testing to get and output axios data
func hello(w http.ResponseWriter, r *http.Request) {
if err := http.ListenAndServe(":3000/Register", nil); err != nil {
         log.Fatal(err)

      }
               body := requestBody{}
                  decoder := json.NewDecoder(r.Body)
                  if err := decoder.Decode(&body); err != nil {
                      // some error handling
                      return
                  }
                  defer r.Body.Close()
                  test := body.Test
                  fmt.Printf(test)
          }


func main() {

//allows host connection when running MainTest.go
    http.HandleFunc("/", corsAcceptance)

   fmt.Printf("Starting server for testing HTTP POST...\n")
   if err := http.ListenAndServe(":8080", nil); err != nil {
      log.Fatal(err)
   }

    http.HandleFunc("/", hello)
}
