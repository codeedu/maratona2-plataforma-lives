import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {RedisIoAdapter} from "./redis-io/redis-io.adapter";
import express = require('express');
import http = require('http');
import cors = require('cors');
import {EntityNotFoundExceptionFilter} from "./filters/entity-not-found-exception.filter";
import {MicroserviceOptions, Transport} from "@nestjs/microservices";
import {join}  from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const {ExpressPeerServer} = require('peer');

async function createPeerServer() {
    const corsOptions = {
        origin: function (origin, callback) {
            const ALLOW_ORIGINS = process.env.SOCKET_IO_ALLOW_ORIGINS;
            const originNormalized = origin.split(':').length === 2? `${origin}:80`: origin;
            const hasOrigin = ALLOW_ORIGINS.split(',').indexOf(originNormalized) !== -1;
            hasOrigin || ALLOW_ORIGINS === '*:*'
                ? callback(null, true)
                : callback(new Error('Not allowed by CORS'));
        }
    };

    const expressApp = express();
    const server = http.createServer(expressApp);
    expressApp.use(cors(corsOptions));

    const peerServer = ExpressPeerServer(server);
    expressApp.use(peerServer);

    server.listen(process.env.PEER_SERVER_PORT);
}

async function bootstrap() {

    const app = await NestFactory.create(AppModule, {cors: true,});
    app.useGlobalFilters(new EntityNotFoundExceptionFilter());
    app.useWebSocketAdapter(new RedisIoAdapter(app));

    app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.GRPC,
        options: {
            url: process.env.GRPC_SERVER_URL,
            package: 'live',
            protoPath: join(__dirname, 'live/live.proto'),
        },
    });

    await app.startAllMicroservicesAsync();

    await app.listen(process.env.APP_PORT);

    await createPeerServer();

}

bootstrap();
