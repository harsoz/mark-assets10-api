import { Module } from '@nestjs/common';
import { StateMachineCollectionService } from './state-machine-collection.service';
import { StateMachineService } from './state-machine.service';
import { EventService } from './event.service';
import { RepositoryModule } from 'src/infrastructure/repository/repository.module';
import { ThirdPartiesModule } from 'src/shared/third-parties/third-parties.module';
import { OnPendingResourcesEvent } from './events/on-pending-resources.event';
import { EmailModule } from 'src/shared/email/email.module';

@Module({
  imports: [RepositoryModule, ThirdPartiesModule, EmailModule],
  controllers: [],
  providers: [
    StateMachineCollectionService,
    StateMachineService,
    EventService,
    // events
    OnPendingResourcesEvent,
  ],
  exports: [StateMachineService],
})
export class StateMachineModule {}
