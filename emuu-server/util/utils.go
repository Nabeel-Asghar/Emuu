package util

import (
	uuid "github.com/nu7hatch/gouuid"
)

func GenerateID() *uuid.UUID {
	u, _ := uuid.NewV4()

	return u
}
