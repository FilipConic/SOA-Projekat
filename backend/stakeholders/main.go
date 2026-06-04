package main

import (
	"context"
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
)

func main() {
	pool, err := db.Connect()
	if err != nil {
		log.Printf("database connection failed: %v", err)
		return
	}
	defer pool.Close()
	log.Println("connected to database")

	userRepo := repository.NewUserRepository(pool)
	profileRepo := repository.NewProfileRepository(pool)

	handlers := router.Handlers{
		Auth: handler.NewAuthHandler(userRepo),
		User: handler.NewUserHandler(userRepo, profileRepo),
		Profile: handler.NewProfileHandler(profileRepo),
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	srv := &http.Server{
		Addr : ":" + port,
		Handler: router.New(handlers),
		ReadTimeout: 15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout: 60 * time.Second,
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

	ctx, cancel := context.WithTimeout(context.Background(), 10 * time.Second)
	defer cancel()
	
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("forced shutdown: %v", err)
	}
	log.Println("server stopped cleanly")
}
