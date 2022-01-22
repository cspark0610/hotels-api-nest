import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });
  app.useGlobalPipes(new ValidationPipe({ forbidNonWhitelisted: true }));
  //app.setGlobalPrefix('api');
  console.log('listening on port ' + 4000);
  await app.listen(4000);
}
bootstrap();
