import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'NOTIFICATION_SERVICE_URL', // Configúralo desde tu .env
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}