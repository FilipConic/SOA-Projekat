package tours

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
)

type TourPurchasedEvent struct {
	TourID    string `json:"tourId"`
	TouristID string `json:"touristId"`
}

type RabbitConsumer struct {
	conn    *amqp.Connection
	channel *amqp.Channel
	service *Service
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

func NewRabbitConsumer(service *Service) *RabbitConsumer {
	rabbitURL := os.Getenv("RABBITMQ_URL")
	if rabbitURL == "" {
		rabbitURL = "amqp://guest:guest@localhost:5672/"
	}

	conn, err := dialWithRetry(rabbitURL)
	if err != nil {
		log.Fatalf("Neuspešno povezivanje na RabbitMQ: %v", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("Neuspešno otvaranje RabbitMQ kanala: %v", err)
	}

	return &RabbitConsumer{
		conn:    conn,
		channel: ch,
		service: service,
	}
}

func (c *RabbitConsumer) Start() {
	exchangeName := "purchase-exchange"
	err := c.channel.ExchangeDeclare(
		exchangeName,
		"topic",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Greška pri deklarisanju exchange-a: %v", err)
	}

	queueName := "tours-purchase-queue"
	q, err := c.channel.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Greška pri deklarisanju reda: %v", err)
	}

	routingKey := "purchase.completed"
	err = c.channel.QueueBind(
		q.Name,
		routingKey,
		exchangeName,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Greška pri vezivanju reda i exchange-a: %v", err)
	}

	msgs, err := c.channel.Consume(
		q.Name,
		"",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalf("Greška pri pokretanju konzumiranja: %v", err)
	}

	go func() {
		log.Printf(" [*] Tours servis sluša RabbitMQ na redu: %s", q.Name)
		for d := range msgs {
			var event TourPurchasedEvent

			err := json.Unmarshal(d.Body, &event)
			if err != nil {
				log.Printf("Greška pri parsiranju poruke sa Rabbit-a: %v", err)
				continue
			}

			log.Printf("[RabbitMQ] Primljen event! TourID: %s, TouristID: %s", event.TourID, event.TouristID)

			dto := CreatePurchaseTokenDTO{
				TourID:    event.TourID,
				TouristID: event.TouristID,
			}

			err = c.service.AddPurchaseToken(dto)
			if err != nil {
				log.Printf("Greška prilikom čuvanja tokena: %v", err)
			} else {
				log.Printf("Token uspešno upisan u tours bazu preko Rabbit-a!")
			}
		}
	}()
}

func (c *RabbitConsumer) Close() {
	if c.channel != nil {
		c.channel.Close()
	}
	if c.conn != nil {
		c.conn.Close()
	}
}
