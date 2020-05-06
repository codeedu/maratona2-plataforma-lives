import {Injectable} from '@nestjs/common';
import {Connection, EntitySubscriberInterface, InsertEvent, Repository} from "typeorm";
import {Live, LiveStatus} from "../live.model";
import * as crypto from 'crypto'
import {InjectRepository} from "@nestjs/typeorm";
import {bcrypt} from "../../utils/bcrypt";

@Injectable()
export class LiveSubscriberService implements EntitySubscriberInterface<Live> {
    constructor(
        connection: Connection,
        @InjectRepository(Live)
        private readonly orderRepo: Repository<Live>
    ) {
        connection.subscribers.push(this);
    }

    listenTo() {
        return Live;
    }

    async beforeInsert(event: InsertEvent<Live>) {
        const live = event.entity;
        live.slug = crypto.randomBytes(8).toString('hex');
        live.status = LiveStatus.PENDING;
        live.password = bcrypt(live.password);
    }
}
