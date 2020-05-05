#!/bin/bash

npm config set cache /home/node/app/.npm-cache --global

cd /home/node/app/frontend

if [ ! -f ".env" ]; then
  cp .env.example .env
fi

npm install
npm run start


