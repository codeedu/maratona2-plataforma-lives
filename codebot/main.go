package main

import (
	"github.com/codeedu/maratona2-codebot/framework/utils"
	"github.com/joho/godotenv"
	"log"
	"os"
)

func init() {
	err := godotenv.Load()

	if err != nil {
		log.Fatalf("Error loading .env file")
	}
}

func main() {
	utils.ConnectDB(os.Getenv("env"))
}
