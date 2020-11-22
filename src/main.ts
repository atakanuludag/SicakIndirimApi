import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    //bodyParser: true,
    logger: console,
  });
  app.setGlobalPrefix('test');
  app.useGlobalPipes(new ValidationPipe()); //Dtolarda tanımlanan tüm validasyonları uygulamaya yarar.
  await app.listen(5050);
}
bootstrap();
