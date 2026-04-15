package handler

import (
	"log"
	"net/http"

	"ai-service/model"
	"ai-service/service"
	"github.com/gin-gonic/gin"
)

func GenerateTest(c *gin.Context) {
	var perf model.PerformanceData
	if err := c.ShouldBindJSON(&perf); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	questions, err := service.GenerateTest(perf)
	if err != nil {
		log.Printf("AI Service Error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"questions": questions})
}
