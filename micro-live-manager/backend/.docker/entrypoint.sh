#!/bin/bash

npm config set cache /home/node/app/.npm-cache --global

cd /home/node/app/backend

if [ ! -f ".env" ]; then
  cp .env.example .env
fi

npm install
npm run typeorm migration:run
npm run start:dev


