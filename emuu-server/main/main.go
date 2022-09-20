package main

import (

    //"log"
"fmt"

   //status "emuu-server/main/status"
   register "emuu-server/main/users"
   //"github.com/gin-gonic/gin"
   //auth "emuu-server/main/firebase"
)




func main() {
    fmt.Println("Host 8080 Listening...")
   register.RegisterUser()

}