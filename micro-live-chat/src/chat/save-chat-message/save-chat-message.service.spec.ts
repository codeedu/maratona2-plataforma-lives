import { Test, TestingModule } from '@nestjs/testing';
import { SaveChatMessageService } from './save-chat-message.service';

describe('SaveChatMessageService', () => {
  let service: SaveChatMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaveChatMessageService],
    }).compile();

    service = module.get<SaveChatMessageService>(SaveChatMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
