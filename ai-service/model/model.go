package model

type PerformanceData struct {
	UserID     int      `json:"user_id"`
	WeakTopics []string `json:"weak_topics"`
	Accuracy   float64  `json:"accuracy"`
	Difficulty string   `json:"difficulty"`
}

type Question struct {
	Question   string   `json:"question"`
	Options    []string `json:"options"`
	Answer     string   `json:"answer"`
	Topic      string   `json:"topic"`
	Difficulty string   `json:"difficulty"`
}

type GenerateTestResponse struct {
	Questions []Question `json:"questions"`
}
