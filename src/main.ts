import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,           // delete fields not defined in dto
    forbidNonWhitelisted: true, // error if aditional not defined fields are presetn
    transform: true,           // tries to convert types
  }));

  const config = new DocumentBuilder()
    .setTitle('Assets10 API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addTag('assets')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);

  const url = await app.getUrl();
  console.log(`Application is running on: ${url}`);
}
bootstrap();
