import { Component, inject, signal } from '@angular/core';
import { ChatService } from '../chat.service';
import { Button } from '../../ui/button/button';
import { Input } from '../../ui/input/input';

@Component({
  selector: 'app-chat-panel',
  imports: [Button, Input],
  templateUrl: './chat-panel.html',
  styleUrl: './chat-panel.css',
})
export class ChatPanel {
  protected readonly chat = inject(ChatService);
  protected readonly draft = signal('');

  send(): void {
    const prompt = this.draft().trim();
    if (!prompt || this.chat.status() === 'streaming') return;
    this.draft.set('');
    this.chat.sendMessage(prompt);
  }
}
