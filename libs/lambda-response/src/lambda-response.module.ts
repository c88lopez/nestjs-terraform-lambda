import { Module } from '@nestjs/common';
import { LambdaResponseService } from './lambda-response.service';
import { LambdaResponseInterceptor } from '@guini/lambda-response/interceptor';

@Module({
  imports: [],
  providers: [LambdaResponseService, LambdaResponseInterceptor],
  exports: [LambdaResponseService],
})
export class LambdaResponseModule {}
