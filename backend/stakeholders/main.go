package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"stakeholders/db"
	"stakeholders/handler"
	"stakeholders/repository"
	"stakeholders/router"
	"syscall"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	pool, err := db.Connect()
	if err != nil {
		log.Printf("database connection failed: %v", err)
		return
	}
	defer pool.Close()
	log.Println("connected to database")

	rabbitURL := os.Getenv("RABBITMQ_URL")
	if rabbitURL == "" {
		// Fallback na localhost ako nisi definisao u docker-compose ili .env fajlu
		rabbitURL = "amqp://guest:guest@localhost:5672/"
	}

	rabbitConn, err := dialWithRetry(rabbitURL)
	if err != nil {
		log.Printf("failed to connect to RabbitMQ: %v", err)
		return
	}
	defer rabbitConn.Close()
	log.Println("connected to RabbitMQ")

	rabbitCh, err := rabbitConn.Channel()
	if err != nil {
		log.Printf("failed to open RabbitMQ channel: %v", err)
		return
	}
	defer rabbitCh.Close()
	log.Println("RabbitMQ channel opened successfully")

	userRepo := repository.NewUserRepository(pool)
	profileRepo := repository.NewProfileRepository(pool)

	handlers := router.Handlers{
		Auth:    handler.NewAuthHandler(userRepo),
		User:    handler.NewUserHandler(userRepo, profileRepo, rabbitCh),
		Profile: handler.NewProfileHandler(profileRepo, rabbitCh),
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	srv := &http.Server{
		Addr:              ":" + port,
		Handler:           router.New(handlers),
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
		ReadHeaderTimeout: 5 * time.Second,
	}

	go func() {
		log.Printf("stakeholders service listening on port :%s", port)
		if err := srv.ListenAndServe(); err != nil {
			log.Fatalf("server error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("shutting down...")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("forced shutdown: %v", err)
	}
	log.Println("server stopped cleanly")
}

func dialWithRetry(rabbitURL string) (*amqp.Connection, error) {
	var conn *amqp.Connection
	var err error

	for i := 1; i <= 10; i++ {
		conn, err = amqp.Dial(rabbitURL)
		if err == nil {
			log.Printf("Uspešno konektovan na RabbitMQ (pokušaj %d)", i)
			return conn, nil
		}
		log.Printf("RabbitMQ nije dostupan, pokušaj %d/10. Čekam 3s... (%v)", i, err)
		time.Sleep(3 * time.Second)
	}
	return nil, fmt.Errorf("nije moguće konektovati se na RabbitMQ nakon 10 pokušaja: %w", err)
}
