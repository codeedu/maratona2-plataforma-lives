import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {cors: true,});
    await app.listen(process.env.APP_PORT);
}

bootstrap();
