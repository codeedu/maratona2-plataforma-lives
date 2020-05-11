import {
    ConnectedSocket,
    MessageBody,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {Inject} from "@nestjs/common";
import {ClientGrpc} from "@nestjs/microservices";
import {ConfigService} from "@nestjs/config";
import {RedisClient} from "@nestjs/microservices/external/redis.interface";
import {AmqpConnection} from "@golevelup/nestjs-rabbitmq";
import {InjectRepository} from "@nestjs/typeorm";
import {ChatMessage} from "../chat-message.model";
import {Repository} from "typeorm";
import {promisify} from "util";
import {Observable} from "rxjs";

interface RedisGet {
    (value: string): Promise<string>
}

interface RedisSet {
    (key: string, value: string): Promise<string>
}

interface LiveRpc {
    validate(data): Observable<any>

    findOne(data): Observable<any>
}

interface BotRpc {
    answer(data): Observable<any>

}

@WebSocketGateway(0, {
    namespace: 'room'
})
export class RoomsService implements OnGatewayInit {
    @WebSocketServer()
    private server: Server;

    constructor(
        private config: ConfigService,
        @Inject('LIVE_PACKAGE') private liveRpc: ClientGrpc,
        @Inject('BOT_PACKAGE') private botRpc: ClientGrpc,
        private amqpConnection: AmqpConnection,
        @InjectRepository(ChatMessage)
        private readonly chatMessageRepo: Repository<ChatMessage>
    ) {
    }

    afterInit(instance) {
        const origins = this.config.get('SOCKET_IO_ALLOW_ORIGINS').split(',');
        const server: Server = instance.server;
        server.origins(origins);
    }

    private static redisClient(client) {
        const redisClient: RedisClient = client.adapter.pubClient;

        const redisGet: RedisGet = promisify(redisClient.get).bind(redisClient);

        const redisSet: RedisSet = promisify(redisClient.set).bind(redisClient);

        return {redisGet, redisSet}
    }

    @SubscribeMessage('join')
    async onJoin(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { user_name: string, email: string, password: string, room: string }
    ) {
        try {
            const service: LiveRpc = this.liveRpc.getService('LiveService');
            const {user_name, email, password, room} = data;
            const {redisSet} = RoomsService.redisClient(client);
            if (password) {
                await service.validate({slug: room, password}).toPromise()
            }

            const live = await this.getLive(client, room);

            this.validateIsPending(live);

            client.join(room);
            console.log('join', client.id);
            await redisSet(client.id, JSON.stringify({
                user_name,
                email,
                is_broadcaster: password !== undefined,
                live_slug: room
            }));
            const messages = await this.chatMessageRepo.find({
                where: {live_slug: room},
                order: {created_at: 'ASC'}
            });
            client.emit('get-messages', messages);

            console.log('client joined');
        } catch (e) {
            console.error(e);
            this.disconnectClient(client, e);
        }
    }

    @SubscribeMessage('send-message')
    async sendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { content: string }
    ) {
        try {
            const {redisGet} = RoomsService.redisClient(client);
            const value: any = await redisGet(client.id);
            if (!value) {
                const error = new Error('Not authorized');
                error.name = 'NotAuthorized'
                throw error;
            }
            const {user_name, email, is_broadcaster, live_slug} = JSON.parse(value);
            const live = await this.getLive(client, live_slug);
            this.validateIsPending(live);

            if (data.content.startsWith('/')) { // /test ola
                const service: BotRpc = this.botRpc.getService('BotService');
                const botName = data.content.split('/')[1].split(' ')[0];
                const command = data.content.split(' ')[1]
                service
                    .answer({botName,command})
                    .toPromise()
                    .then((result) => {
                        console.log(result);
                        client.emit('new-message', {
                            user_name: 'CodeBot',
                            email: 'codebot@code.education',
                            content: result.answer,
                            is_broadcaster: true
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                        client.emit('new-message', {
                            user_name: 'CodeBot',
                            email: 'codebot@code.education',
                            content: 'Não entendi sua mensagem',
                            is_broadcaster: true
                        });
                    });

                return;
            }

            client.broadcast.to(live_slug).emit('new-message', {
                user_name,
                email,
                content: data.content,
                is_broadcaster
            });

            await this.amqpConnection.publish(
                'chat-message',
                '',
                {
                    content: data.content,
                    user_name,
                    email,
                    live_slug,
                    is_broadcaster
                }
            );

            console.log('message sent');
        } catch (e) {
            console.error(e);
            if (e.name === 'NotAuthorized') {
                this.disconnectClient(client, e);
            }
        }
    }

    @SubscribeMessage('finish-room')
    async finishRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() fn
    ) {
        console.log('finish-room', client.id);
        try {
            const {redisGet, redisSet} = RoomsService.redisClient(client);
            const value: any = await redisGet(client.id);
            if (!value) {
                const error = new Error('Not authorized');
                throw error;
            }
            const {is_broadcaster, live_slug} = JSON.parse(value);
            const live = await this.getLive(client, live_slug);
            if (!is_broadcaster || live.status === 'done') {
                const error = new Error('Not authorized');
                throw error;
            }


            await redisSet(live_slug, JSON.stringify({...live, status: 'done'}));
            client.broadcast.to(live_slug).emit('finish-room');

            console.log('room finished');
        } catch (e) {
            console.error(e);
            if (e.name === 'NotAuthorized') {
                this.disconnectClient(client, e);
            }
        }
    }

    private async getLive(client: Socket, liveSlug) {
        const {redisGet, redisSet} = RoomsService.redisClient(client);
        try {
            const result = await redisGet(liveSlug);
            if (!result) {
                throw new Error('Live not found in redis')
            }
            return JSON.parse(result);
        } catch (e) {
            console.error(e);
            const service: LiveRpc = this.liveRpc.getService('LiveService');
            const live = await service.findOne({slug: liveSlug}).toPromise();
            await redisSet(liveSlug, JSON.stringify(live));
            return live;
        }
    }

    private validateIsPending(live) {
        if (!live || live.status !== 'pending') {
            const error = new Error('Not authorized');
            error.name = 'NotAuthorized';
            throw error;
        }
    }

    disconnectClient(client: Socket, error: Error) {
        client.error({message: error.message, name: error.name});
        client.disconnect(true);
    }
}
