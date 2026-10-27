import { Injectable, signal } from '@angular/core';
import { mockLlmStream } from './mock-llm';

export type ChatRole = 'user' | 'assistant';
export type MessageStatus = 'streaming' | 'done' | 'error';

export interface ChatMessage {
  id: number;
  role: ChatRole;
  content: string;
  status: MessageStatus;
}

let nextId = 0;

@Injectable({ providedIn: 'root' })
export class ChatService {
  readonly messages = signal<ChatMessage[]>([]);
  readonly status = signal<'idle' | 'streaming' | 'error'>('idle');

  private controller: AbortController | null = null;
  private lastPrompt: string | null = null;

  async sendMessage(prompt: string): Promise<void> {
    this.messages.update((msgs) => [
      ...msgs,
      { id: nextId++, role: 'user', content: prompt, status: 'done' },
    ]);
    this.lastPrompt = prompt;
    await this.streamAnswer(prompt);
  }

  async retry(): Promise<void> {
    if (!this.lastPrompt) return;
    // drop the failed assistant message, keep the user prompt
    this.messages.update((msgs) => msgs.filter((m) => m.status !== 'error'));
    await this.streamAnswer(this.lastPrompt);
  }

  stop(): void {
    this.controller?.abort();
  }

  private async streamAnswer(prompt: string): Promise<void> {
    const assistantId = nextId++;
    this.messages.update((msgs) => [
      ...msgs,
      { id: assistantId, role: 'assistant', content: '', status: 'streaming' },
    ]);
    this.status.set('streaming');

    const controller = new AbortController();
    this.controller = controller;
    const reader = mockLlmStream(prompt, controller.signal).getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        this.appendChunk(assistantId, value);
      }
      this.setMessageStatus(assistantId, 'done');
      this.status.set('idle');
    } catch {
      this.setMessageStatus(assistantId, 'error');
      this.status.set('error');
    } finally {
      this.controller = null;
    }
  }

  private appendChunk(id: number, chunk: string): void {
    this.messages.update((msgs) =>
      msgs.map((m) => (m.id === id ? { ...m, content: m.content + chunk } : m)),
    );
  }

  private setMessageStatus(id: number, status: MessageStatus): void {
    this.messages.update((msgs) => msgs.map((m) => (m.id === id ? { ...m, status } : m)));
  }
}
