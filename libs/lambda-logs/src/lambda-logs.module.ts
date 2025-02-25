import { Module } from '@nestjs/common';
import { LambdaLogsService } from './lambda-logs.service';

@Module({
  providers: [LambdaLogsService],
  exports: [LambdaLogsService],
})
export class LambdaLogsModule {}
