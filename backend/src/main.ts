import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ================= GLOBAL PREFIX =================
  app.setGlobalPrefix('api');

  // ================= VALIDATION =================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // ================= COOKIE PARSER =================
  app.use(cookieParser());

  // ================= CORS (CRITICAL FOR RAILWAY) =================
  const frontendUrl = process.env.FRONTEND_URL;
  app.enableCors({
    origin: frontendUrl
      ? [frontendUrl, frontendUrl.replace(/\/$/, '')]
      : true,
    credentials: true,                // REQUIRED for cookies
  });

  // ================= SWAGGER =================
  const config = new DocumentBuilder()
    .setTitle('Bloom Haven BnB API')
    .setDescription('Enterprise-grade API for booking system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // ================= SERVER START =================
  const port = Number(process.env.PORT) || 3000;

  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on port ${port}`);
}
bootstrap();