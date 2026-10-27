import { TestBed } from '@angular/core/testing';
import { ChatService } from './chat.service';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatService);
  });

  it('streams an answer, accumulating chunks into one assistant message', async () => {
    await service.sendMessage('tell me about the list feature');

    const messages = service.messages();
    expect(messages.length).toBe(2);
    expect(messages[0]).toMatchObject({ role: 'user', content: 'tell me about the list feature' });
    expect(messages[1].role).toBe('assistant');
    expect(messages[1].status).toBe('done');
    expect(messages[1].content.length).toBeGreaterThan(0);
    expect(service.status()).toBe('idle');
  });

  it('stops streaming via AbortController without erroring', async () => {
    const pending = service.sendMessage('give me the long answer please');
    await sleep(60); // let a couple of chunks land first
    service.stop();
    await pending;

    const assistantMsg = service.messages().at(-1)!;
    expect(assistantMsg.status).toBe('done');
    expect(service.status()).toBe('idle');
  });

  it('sets an error state when the stream fails', async () => {
    await service.sendMessage('this will error out');

    const assistantMsg = service.messages().at(-1)!;
    expect(assistantMsg.status).toBe('error');
    expect(service.status()).toBe('error');
  });

  it('retry resends the last prompt, replacing the failed message', async () => {
    await service.sendMessage('this will error out');
    const failedId = service.messages().at(-1)!.id;

    await service.retry();

    const messages = service.messages();
    expect(messages.some((m) => m.id === failedId)).toBe(false);
    expect(messages.length).toBe(2); // user prompt + the retried assistant message
    expect(messages.at(-1)!.role).toBe('assistant');
  });
});
