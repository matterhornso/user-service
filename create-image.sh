#!/usr/bin/env bash

docker rm -f user-service

docker rmi -f user-service

docker image prune -f

docker volume prune -f

docker build -t user-service .
