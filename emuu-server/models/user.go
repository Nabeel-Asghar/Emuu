package models

import (
	uuid "github.com/nu7hatch/gouuid"
)

type User struct {
	ID       uuid.UUID `json:"id"`
Username string    `json:"username"`
Email    string    `json:"email"`
	firstName     string    `json:"firstname"`
	lastName string  `json:"lastname"`
	password string  `json:"password"`
}
