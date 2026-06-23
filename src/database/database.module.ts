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
  password: 'Abel#1234', // La contraseña que configuramos
  database: 'assets10', // Asegúrate de que este nombre exista en SQL
  entities: Object.values(allEntities),
  synchronize: true, // Esto creará las tablas automáticamente
  logging: true, // Útil para ver qué está pasando
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