package main

import (
	"log"

	"ai-service/handler"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file, continuing with system env")
	}

	r := gin.Default()

	// Routes
	r.POST("/generate-test", handler.GenerateTest)

	log.Println("AI Service running on port 8081")
	r.Run(":8081")
}
