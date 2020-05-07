import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ChatModule} from './chat/chat.module';
import {ConfigModule} from "@nestjs/config";
import {ChatMessage} from "./chat/chat-message.model";
import {TypeOrmModule} from "@nestjs/typeorm";

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env'
        }),
        TypeOrmModule.forRoot({
            // @ts-ignore
            type: process.env.TYPEORM_CONNECTION,
            host: process.env.TYPEORM_HOST,
            port: parseInt(process.env.TYPEORM_PORT),
            username: process.env.TYPEORM_USERNAME,
            password: process.env.TYPEORM_PASSWORD,
            database: process.env.TYPEORM_DATABASE,
            entities: [ChatMessage],
        }),
        ChatModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
