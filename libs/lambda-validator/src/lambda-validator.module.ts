import { Module } from '@nestjs/common';
import { LambdaValidatorService } from './lambda-validator.service';

@Module({
  providers: [LambdaValidatorService],
  exports: [LambdaValidatorService],
})
export class LambdaValidatorModule {}
