import { Test, TestingModule } from '@nestjs/testing';
import { LambdaLogsService } from './lambda-logs.service';

describe('LambdaLogsService', () => {
  let service: LambdaLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LambdaLogsService],
    }).compile();

    service = module.get<LambdaLogsService>(LambdaLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
