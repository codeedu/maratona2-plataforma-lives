import { Test, TestingModule } from '@nestjs/testing';
import { LiveSubscriberService } from './live-subscriber.service';

describe('LiveSubscriberService', () => {
  let service: LiveSubscriberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiveSubscriberService],
    }).compile();

    service = module.get<LiveSubscriberService>(LiveSubscriberService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
