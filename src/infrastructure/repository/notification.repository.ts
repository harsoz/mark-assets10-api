import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapNotification } from './mappers';
import { Notification } from 'src/infrastructure/database';
import type { NotificationModel } from 'src/domain/models';

@Injectable()
export class NotificationRepository extends BaseRepository<Notification, NotificationModel> {
  constructor(@InjectRepository(Notification) repo: Repository<Notification>) {
    super(repo);
  }

  public toModel(entity: Notification): NotificationModel {
    return mapNotification(entity);
  }
}