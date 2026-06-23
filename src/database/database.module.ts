import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as allEntities from './index';
import { SampleFeedSeeder } from './feeder/sample-feed-seeder.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sa',
      password: 'Abel#1234',
      database: 'assets10',
      entities: Object.values(allEntities),
      synchronize: true,
      logging: true,
      options: {
        encrypt: false, // Requerido para desarrollo local
        trustServerCertificate: true, // Obligatorio para certificados autofirmados de Docker
      },
    }),
  ],
  controllers: [],
  providers: [SampleFeedSeeder],
})
export class DatabaseModule {}
