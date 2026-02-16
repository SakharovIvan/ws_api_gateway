import { Test, TestingModule } from '@nestjs/testing';
import { WsCoreService } from './ws_core.service';

describe('WsCoreService', () => {
  let service: WsCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WsCoreService],
    }).compile();

    service = module.get<WsCoreService>(WsCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
