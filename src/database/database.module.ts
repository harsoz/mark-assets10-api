import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as allEntities from './index';
import { SampleFeedSeeder } from './feeder/sample-feed-seeder.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>('DB_TYPE', 'mssql'),
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '1433'), 10),
        username: configService.get<string>('DB_USERNAME', 'sa'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE', 'assets10'),
        entities: Object.values(allEntities),
        synchronize: true,
        logging: true,
        options: {
          encrypt: false, // Requerido para desarrollo local
          trustServerCertificate: true, // Obligatorio para certificados autofirmados de Docker
        },
      }),
    }),
  ],
  controllers: [],
  providers: [SampleFeedSeeder],
})
export class DatabaseModule {}
