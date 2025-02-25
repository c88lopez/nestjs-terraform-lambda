import { Test, TestingModule } from '@nestjs/testing';
import { LambdaResponseService } from './lambda-response.service';

describe('LambdaResponseService', () => {
  let service: LambdaResponseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LambdaResponseService],
    }).compile();

    service = module.get<LambdaResponseService>(LambdaResponseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
