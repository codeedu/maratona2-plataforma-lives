#!/bin/bash

npm config set cache /app/.npm-cache --global
cd /app

if [ ! -f ".env" ]; then
  cp .env.example .env
fi

npm install

npm start
