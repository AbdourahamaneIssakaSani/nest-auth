import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

// import cookieParser = require('cookie-parser');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ credentials: true, origin: 'localhost:3000' });
  app.use(cookieParser());

  app.setGlobalPrefix('api');

  // enable URI versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(3000);
}
bootstrap();

//  WARNING: class-validator has a critical vulnerability.
//  WARNING: class-validator has a critical vulnerability.
//  WARNING: class-validator has a critical vulnerability.
//  WARNING: class-validator has a critical vulnerability.
//  WARNING: class-validator has a critical vulnerability.
