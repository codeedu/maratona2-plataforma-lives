import { Test, TestingModule } from '@nestjs/testing';
import { LiveSocketService } from './live-socket.service';

describe('LiveSocketService', () => {
  let service: LiveSocketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveSocketService],
    }).compile();

    service = module.get<LiveSocketService>(LiveSocketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
