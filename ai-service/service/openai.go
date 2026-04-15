package service

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"ai-service/model"
	"github.com/sashabaranov/go-openai"
)

func GenerateTest(perf model.PerformanceData) ([]model.Question, error) {
	apiKey := os.Getenv("GROQ_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GROQ_API_KEY not set")
	}

	// Groq uses an OpenAI compatible API
	config := openai.DefaultConfig(apiKey)
	config.BaseURL = "https://api.groq.com/openai/v1"
	client := openai.NewClientWithConfig(config)

	// Using Llama-3.1 8b on Groq - fast and currently supported
	modelName := "llama-3.1-8b-instant"

	prompt := fmt.Sprintf(`
		Generate a set of 5 MCQ questions for a user with the following performance data:
		- Weak Topics: %v
		- Overall Accuracy: %.2f%%
		- Target Difficulty: %s

		The questions should focus on the weak topics to help the user improve.
		Return the response ONLY as a JSON object with a "questions" field, where each question has:
		"question" (string), "options" (array of 4 strings), "answer" (string - one of the options), "topic" (string), "difficulty" (string).
		Ensure the JSON is well-formatted and contain no extra text.
	`, perf.WeakTopics, perf.Accuracy*100, perf.Difficulty)

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: modelName,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: prompt,
				},
			},
			Temperature: 0.7,
		},
	)

	if err != nil {
		return nil, fmt.Errorf("Groq API error: %v", err)
	}

	content := resp.Choices[0].Message.Content
	
	// Robust JSON extraction
	start := strings.Index(content, "{")
	end := strings.LastIndex(content, "}")
	
	if start == -1 || end == -1 || end <= start {
		return nil, fmt.Errorf("failed to find valid JSON in AI response: %s", content)
	}
	
	cleanJSON := content[start : end+1]

	var result model.GenerateTestResponse
	err = json.Unmarshal([]byte(cleanJSON), &result)
	if err != nil {
		return nil, fmt.Errorf("failed to parse AI response: %v, content: %s", err, cleanJSON)
	}

	return result.Questions, nil
}
