import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {ChatMessage} from "../chat-message.model";
import {Repository} from "typeorm";
import {RabbitSubscribe} from "@golevelup/nestjs-rabbitmq";

@Injectable()
export class SaveChatMessageService {
    constructor(
        @InjectRepository(ChatMessage)
        private readonly chatMessageRepo: Repository<ChatMessage>
    ) {

    }

    @RabbitSubscribe({
        exchange: 'chat-message',
        routingKey: '',
        queue: 'micro-live-chat/chat-message'
    })
    public async rpcHandler(message) {
        const obj = this.chatMessageRepo.create({
            content: message.content,
            user_name: message.user_name,
            email: message.email,
            live_slug: message.live_slug,
            is_broadcaster: message.is_broadcaster
        });
        await this.chatMessageRepo.save(obj);
    }
}
