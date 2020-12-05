import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { Config } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //bodyParser: true,
    logger: console,
  });
  app.setGlobalPrefix(Config.apiPrefix);
  app.useGlobalPipes(new ValidationPipe()); //Dtolarda tanımlanan tüm validasyonları uygulamaya yarar.
  await app.listen(Config.apiPort);
}
bootstrap();