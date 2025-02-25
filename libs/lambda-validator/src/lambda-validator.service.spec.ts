import { Test, TestingModule } from '@nestjs/testing';
import { LambdaValidatorService } from './lambda-validator.service';

describe('LambdaValidatorService', () => {
  let service: LambdaValidatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LambdaValidatorService],
    }).compile();

    service = module.get<LambdaValidatorService>(LambdaValidatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
