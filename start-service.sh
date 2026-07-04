# !/usr/bin/env bash

# MONGODB_URL= ${mongodb://$(docker-machine ip manager1):27017/shine}

docker service create --replicas 1 --name user-service -l=apiRoute='/user' -p 3000:3000 --env MONGODB_URL=mongodb://$(docker-machine ip manager1):27017/shine 104.154.26.100:5000/user-service
# docker run --name user-service -p 3000:3000 user-service
