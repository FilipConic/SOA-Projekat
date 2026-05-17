#!/bin/bash

./protoc-run.sh
cd gateway && CGO_ENABLED=0 GOOS=linux go build -o gateway main.go && cd ..
if command -v docker-compose &> /dev/null; then
    docker-compose up --build
else
    docker compose up --build
fi
