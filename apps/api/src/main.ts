import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips away extra data that isn't in your DTO
    forbidNonWhitelisted: true, // Throws an error if extra data is sent
    transform: true, // Automatically transforms payloads to be objects typed according to DTO classes
  }));
  app.enableCors({
    origin: 'http://localhost:3000', // Your Next.js URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
