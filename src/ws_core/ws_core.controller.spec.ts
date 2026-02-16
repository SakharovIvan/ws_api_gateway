import { Test, TestingModule } from '@nestjs/testing';
import { WsCoreController } from './ws_core.controller';

describe('WsCoreController', () => {
  let controller: WsCoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WsCoreController],
    }).compile();

    controller = module.get<WsCoreController>(WsCoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
