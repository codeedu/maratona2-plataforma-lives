import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Live} from "./live.model";
import {LiveController} from "./live.controller";
import {LiveSubscriberService} from "./live-subscriber/live-subscriber.service";
import {ConfigService} from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forFeature([Live]),
    ],
    controllers: [
        LiveController
    ],
    providers: [
        LiveSubscriberService,
        ConfigService
    ]
})
export class LiveModule {}
