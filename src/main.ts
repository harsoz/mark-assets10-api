import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/');

  const config = new DocumentBuilder()
    .setTitle('Assets10 API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addTag('assets')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);

  const url = await app.getUrl();
  console.log(`Application is running on: ${url}`);
}
bootstrap();
