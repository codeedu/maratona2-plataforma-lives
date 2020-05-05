import {Controller, Get, Post, Req, Request, Param} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Live} from "./live.model";

@Controller('lives')
export class LiveController {

    constructor(
        @InjectRepository(Live)
        private readonly liveRepo: Repository<Live>,
    ) {

    }

    @Get()
    async index() {
        return await this.liveRepo.find({
            order: {
                created_at: 'DESC'
            }
        })
    }

    @Get(':slug')
    async show(@Param('slug') slug) {
        return await this.liveRepo.findOneOrFail({where: {slug}});
    }

    @Post()
    async store(@Req() request: Request) {
        const live = this.liveRepo.create(request.body as any);
        await this.liveRepo.save(live);
        return live;
    }
}
