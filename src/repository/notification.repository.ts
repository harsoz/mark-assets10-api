import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from './base.repository';
import { mapNotification } from './mappers';
import { Notification } from 'src/database';
import type { NotificationModel } from 'src/models';

@Injectable()
export class NotificationRepository extends BaseRepository<Notification, NotificationModel> {
  constructor(@InjectRepository(Notification) repo: Repository<Notification>) {
    super(repo);
  }

  protected toModel(entity: Notification): NotificationModel {
    return mapNotification(entity);
  }
}