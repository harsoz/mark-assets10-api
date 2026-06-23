import { Module } from '@nestjs/common';
import { StateMachineCollectionService } from './state-machine-collection.service';
import { StateMachineService } from './state-machine.service';

@Module({
  imports: [],
  controllers: [],
  providers: [StateMachineCollectionService, StateMachineService],
  exports: [StateMachineService],
})
export class StateMachineModule {}
