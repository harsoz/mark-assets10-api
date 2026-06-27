import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { ThirdPartiesModule } from 'src/shared/third-parties/third-parties.module';

@Module({
  imports: [ThirdPartiesModule],
  controllers: [FileController],
  providers: [],
})
export class FileModule {}
