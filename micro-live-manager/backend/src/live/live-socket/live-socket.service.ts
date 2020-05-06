import {
    ConnectedSocket,
    MessageBody,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import {Server, Socket} from "socket.io";
import {RedisClient} from "redis";
import {ConfigService} from "@nestjs/config";
import {InjectRepository} from "@nestjs/typeorm";
import {Live, LiveStatus} from "../live.model";
import {Repository} from "typeorm";
import {compareHash} from "../../utils/bcrypt";
import {promisify} from 'util';

interface RedisGet {
    (value: string): Promise<string>
}

interface RedisSet {
    (key: string, value: string): Promise<string>
}

@WebSocketGateway(0, {
    namespace: 'live',
})
export class LiveSocketService implements OnGatewayInit {
    @WebSocketServer()
    private server: Server;


    constructor(
        private config: ConfigService,
        @InjectRepository(Live)
        private readonly liveRepo: Repository<Live>,
    ) {

    }

    private static redisClient(client) {
        const redisClient: RedisClient = client.adapter.pubClient;

        const redisGet: RedisGet = promisify(redisClient.get).bind(redisClient);

        const redisSet: RedisSet = promisify(redisClient.set).bind(redisClient);

        return {redisGet, redisSet}
    }

    afterInit(instance) {
        const origins = this.config.get('SOCKET_IO_ALLOW_ORIGINS').split(',');
        const server: Server = instance.server;
        server.origins(origins);
    }

    @SubscribeMessage('join')
    async onJoin(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { slug: string }
    ) {
        try {
            const {slug} = data;
            const {redisSet, redisGet} = LiveSocketService.redisClient(client);

            this.validateViewer(slug);

            client.join(slug);
            console.log('join', client.id);

            await redisSet(client.id, slug);

            const peer_id = await redisGet(slug);
            client.emit('get-broadcaster', {peer_id});

            const countUsers = this.getUsersConnected(client, slug);
            client.emit('count-users', countUsers);
            client.broadcast.to(slug).emit('count-users', countUsers);

            console.log('client joined');
        } catch (e) {
            console.error(e);
            client.error({message: e.message, name: e.name});
        }
    }

    @SubscribeMessage('leave')
    async onLeave(@ConnectedSocket() client: Socket) {
        try {
            const {redisGet} = LiveSocketService.redisClient(client);
            const slug = await redisGet(client.id);
            if (!slug) {
                const error = new Error('Not authorized');
                throw error;
            }
            this.validateViewer(slug);

            client.leave(slug);

            client.broadcast.to(slug).emit('count-users', this.getUsersConnected(client, slug));
            client.disconnect(true);
            console.log('leave', client.id);
        } catch (e) {
            console.error(e);
            client.error({message: e.message, name: e.name});
        }
    }


    @SubscribeMessage('set-broadcaster')
    async setBroadcaster(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { peer_id: string, password: string }
    ) {
        try {
            const {redisGet, redisSet} = LiveSocketService.redisClient(client);
            const slug = await redisGet(client.id);
            if (!slug) {
                const error = new Error('Not authorized');
                throw error;
            }
            await this.validateBroadcaster(slug, data.password);

            await redisSet(slug, data.peer_id);

            client.broadcast.to(slug).emit('get-broadcaster', {peer_id: data.peer_id});
        } catch (e) {
            console.error(e);
            client.error({message: e.message, name: e.name});
        }
    }

    @SubscribeMessage('finish-live')
    async getFinishLive(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { password: string }
    ) {
        try {
            const {redisGet} = LiveSocketService.redisClient(client);
            const slug = await redisGet(client.id);
            if (!slug) {
                const error = new Error('Not authorized');
                throw error;
            }
            const obj = await this.validateBroadcaster(slug, data.password);

            obj.status = LiveStatus.DONE;
            await this.liveRepo.save(obj);

            client.broadcast.to(slug).emit('finish-live', obj);
        } catch (e) {
            console.error(e);
            client.error({message: e.message, name: e.name});
        }
    }

    private async validateBroadcaster(slug, password) {
        const obj = await this.liveRepo.findOne({where: {slug}});
        if (!obj || !compareHash(password + "", obj.password + "")) {
            const error = new Error('Not authorized');
            error.name = 'NotAuthorized';
            throw error;
        }

        if (obj.status !== LiveStatus.PENDING) {
            const error = new Error('The live status must be pending');
            error.name = 'LiveNotPending';
            throw error;
        }

        return obj;
    }

    private async validateViewer(slug) {
        const obj = await this.liveRepo.findOne({where: {slug}});

        if (!obj) {
            const error = new Error('Not authorized');
            error.name = 'NotAuthorized';
            throw error;
        }

        if (obj.status !== LiveStatus.PENDING) {
            const error = new Error('The live status must be pending');
            error.name = 'LiveNotPending';
            throw error;
        }

        return obj;
    }

    getUsersConnected(client: Socket, room) {
        return room in client.adapter.rooms ? client.adapter.rooms[room].length : 0;
    }


}

