import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import Swagger from './module';
import { writeFileSync } from 'fs';

(async () => {
  const app = await NestFactory.create(Swagger);

  await app.init();

  const config = new DocumentBuilder()
    .setTitle('Rentcheck API')
    .setDescription('Rentcheck API Documentation')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const doc = JSON.stringify(document);

  writeFileSync(`${__dirname}/../../../docs.json`, doc, { flag: 'w+' });

  return;
})();
