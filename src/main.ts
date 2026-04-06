import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://127.0.0.1:5174',
      'http://127.0.0.0:5174',
      'http://localhost:5174',
    ], // разрешенные домены (* — любые)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // разрешаем передачу cookies
    allowedHeaders: 'Content-Type, Authorization', // разрешаемые заголовки
    exposedHeaders: 'Authorization', // показываемые клиенту заголовки
    preflightContinue: false,
  });
  await app.listen(process.env.PORT ?? 3000);
  await app.init();
}
bootstrap();
