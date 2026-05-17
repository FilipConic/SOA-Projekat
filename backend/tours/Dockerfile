# syntax=docker/dockerfile:1
FROM golang:1.26.1-alpine AS builder
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /tours ./cmd/servers

FROM alpine:3.19
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /tours /app/tours

EXPOSE 8080
ENTRYPOINT ["/app/tours"]
