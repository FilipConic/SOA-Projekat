package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"tours/internal/tours"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	dbHost := getEnv("DB_HOST", "localhost")
	dbUser := getEnv("DB_USER", "postgres")
	dbPassword := getEnv("DB_PASSWORD", "tvoja_lozinka")
	dbName := getEnv("DB_NAME", "tours_db")
	dbPort := getEnv("DB_PORT", "5432")

	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		dbHost, dbUser, dbPassword, dbName, dbPort)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Greška pri povezivanju na bazu: %v", err)
	}

	err = db.AutoMigrate(
		&tours.Tour{},
		&tours.KeyPoint{},
		&tours.Review{},
		&tours.TouristPosition{},
	)
	if err != nil {
		log.Fatalf("Greška tokom migracije: %v", err)
	}

	repo := tours.NewPostgresRepo(db)

	service := tours.NewService(repo)
	handler := tours.NewHandler(service)

	mux := http.NewServeMux()
	handler.RegisterRoutes(mux)

	log.Printf("Tours servis uspešno pokrenut na portu :8082 (Baza povezana na %s:%s)\n", dbHost, dbPort)
	if err := http.ListenAndServe(":8082", enableCORS(mux)); err != nil {
		log.Fatalf("Server pao: %v", err)
	}
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, X-User-ID, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}
