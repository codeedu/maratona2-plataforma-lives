import { Test, TestingModule } from '@nestjs/testing';
import { LiveController } from './live.controller';

describe('Live Controller', () => {
  let controller: LiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiveController],
    }).compile();

    controller = module.get<LiveController>(LiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
